import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, extendObservable} from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Rectangle, ResponsiveContainer } from 'recharts';
import LoadingIndicator from '../LoadingIndicator';
import Checkbox from 'material-ui/Checkbox';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';
import Divider from 'material-ui/Divider';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { FacebookButton, TwitterButton } from "react-social";
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
// import Divider from 'material-ui/Divider';
// import intersection from 'lodash/intersection';
// import difference from 'lodash/difference';
// import Toggle from 'material-ui/Toggle';

import ResultsComponent from './ResultsComponent';
import './CompareUsers.css';

const labels = {
  "strongly_agree": {label: "Strongly Agree", color: "rgb(74,178,70)"},
  "agree": {label: "Agree", color: "rgb(133,202,102)"},
  "neutral": {label: "Neutral", color: "rgb(128, 128, 128)"},
  "disagree": {label: "Disagree", color: "rgb(249,131,117)"},
  "strongly_disagree": {label: "Strongly disagree", color: "rgb(244,56,41)"}
}

const CompareCollectionUsers = inject("CollectionStore", "UserStore", "QuestionStore")(observer(({ CollectionStore, UserStore, QuestionStore, userIds = [6, 7,322,45], collectionId = 24}) => {

  let userLoggedIn = UserStore.isLoggedIn();
  let currentUserId = userLoggedIn && UserStore.userData.get("id");
  let viewData = observable.shallowObject({
    isLoggedIn: userLoggedIn,
    users: observable.shallowArray([]),
    compareData: observable.shallowMap(),
    following: observable.shallowMap(),
    questions: observable.shallowArray()
  });

  if (!userIds.length) console.log('No users specified to compare');
  if (userLoggedIn) {
    CollectionStore.getCollectionItemsById(collectionId)
      .then((res) => {
        console.log('collection', res);
        return viewData.questions.push(res)
      })
    userIds.map((id) => {
      UserStore.getUserById(id).then((res) => {console.log('userB', res) ; return viewData.users.push(res)})
      UserStore.compareUsers(currentUserId, id).then((res) => {return viewData.compareData.set(id, res)})
      UserStore.amFollowingUser(currentUserId, id).then((res) => {
        let result = res.results[0] ? res.results[0].id : res.count;
        return viewData.following.set(id, result)
      })
    })
  }


  return <CompareCollectionUsersView data={viewData} />
}))


//View of short compare and short questions info
const CompareCollectionUsersView = observer(({data})=> {
  if (!data.isLoggedIn) return <SignInToSeeView />;
  if (!data.questions.length || !data.users.length || !data.following || !data.compareData)
    return <LoadingIndicator />;

  return (
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
      <div style={{display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420, border: '3px solid lime', overflow: 'auto'}}>
      {data.compareData && data.users.map((user) => {
        console.log('userB, data', user, data)
        return (
          <div key={user.id} style={{flex: '1'}}>
            <UserCardSmall user={user}
              compareData={data.compareData.get(user.id)}
              following={data.following.get(user.id)}/>
          </div>
        )
      })}
    </div>
    <div style={{flex: '1'}}>
    <p>Connect with messenger</p>
      <TwitterButton element="span" url=''> {/* {document.referrer}> */}
        <FlatButton
          href="https://github.com/callemall/material-ui"
          target="_blank"
          label="Send to messenger"
          fullWidth={true}
          icon={<TwitterBox color={blue500} />}
          />
      </TwitterButton>
    </div>

    <div style={{display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420, border: '3px solid lime', overflow: 'auto'}}>
    {data.questions.length > 0 &&
      data.questions[0].map((question, i) => {
        console.log('question', question)
      return (
        <div key={`ques-${i}`} style={{flex: '1', minWidth: 320}}>
          <ResultsComponent questionId={question.object_id}/>
        </div>
      )
    })
      }
    </div>

    <CardText>
      <p style={{textAlign: 'left'}}>Your interests</p>
      <p style={{textAlign: 'left'}}>Would you like to see more of any of these?</p>
      <a href='#' style={{textDecoration: 'underline'}}>(Browse all topics)</a>

      <div style={{marginTop: 10}}>
        <Toggle
          label="Politics"
          style={{marginBottom: 0, }}
        />
        <Toggle
          label="War"
          style={{marginBottom: 0}}
        />
        <Toggle
          label="Education"
          defaultToggled={true}
          style={{marginBottom: 0}}
        />
      </div>

  </CardText>
  </div>

)
})


//nice, but requires all screen
// const CompareCollectionUsersView = observer(({data})=> {
//   if (!data.isLoggedIn) return <SignInToSeeView />;
//   if (!data.users.length) return <LoadingIndicator />;
//   return (
//         <div>
//         <div style={{height: 200, backgroundColor: 'white'}}>
//          <AutoRotatingCarousel
//            label="Get started"
//            open
//            autoplay={false}
//          >{data && data.users.map((user) => {
//            console.log('userB, data', user, data)
//            return (
//            <Slide key={user.id}
//              media={data.compareData && <UserCardSmall user={user}
//                compareData={data.compareData.get(user.id)}/>}
//              mediaBackgroundStyle={{ backgroundColor: 'white' }}
//              contentStyle={{ backgroundColor: 'white' }}
//              title="This is a very cool feature"
//              subtitle="Just using this will blow your mind."
//            />)})}
//
//         </AutoRotatingCarousel>
//         </div>
//         </div>
//       )
//     })


@inject("user", "compareData", "following", 'UserStore') @observer class UserCardSmall extends Component {

  state = {
    //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
    checked: [true,true,false,false,false]
  }

  setFollowing = () => {
    this.props.UserStore.setFollowing(this.props.compareData.userb)
  }
  removeFollowing = () => {
    this.props.UserStore.removeFollowing(this.props.following)
  }
  render(){
    // if (!this.props.user) return null;
    if (!this.props.user) return <LoadingIndicator />;
    let name, age, photo, bio,
      location, count_comments,
      count_followers, count_following_users,
      count_group_memberships,
      count_question_votes, count_votes;
    if (this.props.user) {
      name = this.props.user.first_name ? this.props.user.first_name + ' ' + this.props.user.last_name : this.props.user.username;
      age = this.props.user.age ? this.props.user.age  : '';
      bio = this.props.user.bio ? this.props.user.bio  : '';
      photo = this.props.user.photo ? this.props.user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random()*7)}.png`;;
      location = (this.props.user.country_info ? this.props.user.country_info.name + (this.props.user.region_info ? ', ' : '') : '') + (this.props.user.region_info ? this.props.user.region_info.name : '');
      count_comments = this.props.user.count_comments
      count_followers = this.props.user.count_followers
      count_following_users = this.props.user.count_following_users
      count_group_memberships = this.props.user.count_group_memberships
      count_question_votes = this.props.user.count_question_votes
      count_votes = this.props.user.count_votes
    }
    let concensus = '';
    if(this.props.compareData) {
     concensus = Math.floor(100-this.props.compareData.difference_percent)
    }


    console.log('RESULT', this.props.following)

    return (
      this.props &&
      <Card style={{margin: '20px', border: '1px solid grey', boxShadow: '0px 0px 5px grey', maxHeight: 500, minHeihgt: 300, minWidth: 280}}>
      <CardHeader
        title={name}
        subtitle={age ? age + 'years old ' + location + ' ' + bio: location + ' ' + bio}
        avatar={<Avatar src={photo} style={{alignSelf: 'center', display: 'block', margin: '5px auto'}}/>}
        subtitleStyle={{display: 'block', width: '150%', textAlign: 'center'}}
        titleStyle={{display: 'block', width: '150%', textAlign: 'center'}}
        />

        <Divider/>
        <div style={{backgroundColor: '#e6f7ff', padding: 15}}>
        <div>
          {/* <p style={{fontSize: 14, fontWeight: 'bold'}}>How do I compare to {name}?</p> */}
          <p style={{fontSize: 30, textAlign: 'center'}}>{`${concensus}%`}</p>
          <p>match <a>(detail)</a></p>

        {/* in reality need to display if i'm following this user */}
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 10px 0px'}}>
          { this.props && this.props.following > 0 ?
            <FlatButton
              label="following"
              primary={true}
              style={{border: '2px solid green', borderRadius: 10, flex: 1, maxWidth: 120, color: 'green'}}
              onTouchTap={this.removeFollowing}
            /> :
            <FlatButton
              label="follow"
              primary={false}
              style={{border: '2px solid navy', borderRadius: 10, flex: 1, maxWidth: 120, color: 'navy'}}
              onTouchTap={this.setFollowing}
              /> }
          </div>
        </div>
    </div>
    <Divider/>
    <div style={{display: 'flex', flexFlow: 'row nowrap', width: '100%', alignItems: 'middle'}}>
      <FlatButton
        label="follow"
        primary={false}
        style={{flex: 1, maxWidth: 100}}
        onTouchTap={this.setFollowing}
        disabled={this.props && this.props.following > 0}
        />
      <FlatButton
        label="compare"
        primary={true}
        style={{flex: 1, maxWidth: 100}}
        //onTouchTap={this.compare}
        />
    </div>
    </Card>
  )
}}

//const UserCard = observer(({user, compareData}) => {
@inject("user", "compareData") @observer class UserCard extends Component {

  state = {
    //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
    checked: [true,true,false,false,false]
  }

  handleCheck = (e, value) => {
    switch(e.target.value){
      case 'disagree': {
        let checked = this.state.checked;
        return this.setState({checked: [...checked.slice(0,3), value, value]})
      }
      case 'agree': {
        let checked = this.state.checked;
        return this.setState({checked: [value, value, ...checked.slice(2)]})
      }
      case 'neutral': {
        let checked = this.state.checked;
        return this.setState({checked: [...checked.slice(0,2), value, ...checked.slice(3)]})
      }
      default: return
    }
  }
  changeFollow = () => {
    //update auth/me/ to follow user
  }
  render(){
    if (!this.props.user) return null;

    let name, age, photo, bio,
      location, count_comments,
      count_followers, count_following_users,
      count_group_memberships,
      count_question_votes, count_votes;
    if (this.props.user) {
      name = this.props.user.first_name ? this.props.user.first_name + ' ' + this.props.user.last_name : this.props.user.username;
      age = this.props.user.age ? this.props.user.age  : '';
      bio = this.props.user.bio ? this.props.user.bio  : '';
      photo = this.props.user.photo ? this.props.user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random()*7)}.png`;;
      location = (this.props.user.country_info ? this.props.user.country_info.name + (this.props.user.region_info ? ', ' : '') : '') + (this.props.user.region_info ? this.props.user.region_info.name : '');
      count_comments = this.props.user.count_comments
      count_followers = this.props.user.count_followers
      count_following_users = this.props.user.count_following_users
      count_group_memberships = this.props.user.count_group_memberships
      count_question_votes = this.props.user.count_question_votes
      count_votes = this.props.user.count_votes
    }
    let concensus = '';
    if(this.props.compareData) {
     concensus = Math.floor(100-this.props.compareData.difference_percent)
    }
    let totalCount = 0;
    if (this.props.compareData) totalCount = this.props.compareData.difference_distances.reduce((a,b) => a+b,0)
    let values = null;
    if (this.props.compareData) values = {
      agree: Math.round(1000 *(this.props.compareData.difference_distances[0]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[1]) / totalCount)/10,
      neutral: Math.round(1000 *(this.props.compareData.difference_distances[2]) / totalCount)/10,
      disagree: Math.round(1000 *(this.props.compareData.difference_distances[3]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[4]) / totalCount)/10,
      };
    console.log('totalCount.values', totalCount, values)
    console.log('this.state', this.state)

    let display_all = {};

    if(this.props.compareData) {
      let arr =[];
      let not_arr =[];
      this.state.checked.map((elt,i) => {
        if (elt) arr.push(i.toString())
        else not_arr.push(i.toString())
      })

      const keys = Object.keys(this.props.compareData.topic_diffs)
      //console.log('keys.length', keys.length)
      let display = {};
      keys.map((k)=> {
        let check1 = false;
        let check2 = false;

        check1 = arr.map((key,j)=> this.props.compareData.topic_diffs[k].diffs[key] > 0 ? true : false)
        check1 = check1.includes(true)
        check2 = not_arr.map((key,j)=> this.props.compareData.topic_diffs[k].diffs[key] === 0 ? true : false)
        check2 = !check2.includes(false)


        if (check1 && check2) display = Object.assign(display, {[k]: this.props.compareData.topic_diffs[k]})

      })
    display_all = Object.assign(display_all, display);

  }

    //console.log('result', Object.keys(display_all).length, display_all)

    return (
      this.props.compareData &&
      <Card style={{marginBottom: '20px', border: '2px solid grey', boxShadow: '0px 0px 5px grey', height: 800}}>
      <CardHeader
        title={name}
        subtitle={age ? age + 'years old, ' + location : location}
        avatar={photo}
        />
        {/* <CardText style={{paddingTop: 0}}>
          <span>{bio ? bio : ''}</span>
        </CardText> */}

        {/* in reality need to display if i'm following this user */}
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 10px 0px'}}>
          { count_following_users ?
            <FlatButton
              label="follow"
              primary={true}
              style={{border: '1px solid grey', borderRadius: 10, flex: 1, maxWidth: 100}}
              onTouchTap={this.changeFollow}
            /> :
            <FlatButton
              label="following"
              primary={false}
              style={{border: '1px solid grey', borderRadius: 10, flex: 1, maxWidth: 100}}
              onTouchTap={this.changeFollow}
              /> }
          </div>


        <div className='container'>
          <div className='inner'>
            <p>{count_question_votes}</p>
            <p>Answers</p>
          </div>
          <div className='inner'>
            <p>{count_followers}</p>
            <p>Followers</p>
          </div>
          <div className='inner'>
            <p>{count_comments}</p>
            <p>Comments</p>
          </div>
        </div>

      <div style={{backgroundColor: '#e6f7ff'}}>
        <div>
          {/* <p style={{fontSize: 14, fontWeight: 'bold'}}>How do I compare to {name}?</p> */}
          <p style={{fontSize: 30, textAlign: 'center'}}>{`${concensus}%`}</p>
          <p>avg. agreement</p>
        </div>

        <div className='containerSmall' style={{justifyContent: 'center'}}>
          <div className='innerSmall'>
            <p><span>&#9786;</span>{`${values.agree}%`}</p>
            <CheckboxComponent label='AGREE' fill={labels['strongly_agree']['color']} handleCheck={this.handleCheck} value='agree' checked={this.state.checked[0]}/>
          </div>
          <div className='innerSmall'>
            <p><span>&#9737;</span>{`${values.neutral}%`}</p>
            <CheckboxComponent label='NEUTRAL' fill={labels['neutral']['color']} handleCheck={this.handleCheck} value='neutral' checked={this.state.checked[2]}/>
          </div>
          <div className='innerSmall'>
            <p><span>&#9785;</span>{`${values.disagree}%`}</p>
            <CheckboxComponent label='DISAGREE' fill={labels['strongly_disagree']['color']} handleCheck={this.handleCheck} value='disagree' checked={this.state.checked[4]}/>

          </div>
        </div>

        <CardText style={{paddingTop: 0}}>
          {this.props.compareData ? (
            <div>
              <MatchBarchart compareData={this.props.compareData} />
              <CardText style={{paddingTop: 0}}>
                <p>{`Compared across: ${this.props.compareData.questions_counted} questions`}</p>
              </CardText>
            </div>) : <LoadingIndicator />}
        </CardText>

        <CardText style={{paddingTop: 0}}>
          {Object.keys(display_all).length >0 && (
            <div className='barContainer'>
            {Object.keys(display_all)//Object.keys(this.props.compareData.topic_diffs)
              .map((d,i)=>
              <li key={`i-${i}`} style={{listStyle: 'none', backgroundColor: 'transparent'}}>
                <div>
                  <div style={{display: 'block', marginLeft: 10, marginBottom: 2}}>
                    {`On topic: ${d}`}
                  </div>
                  <div style={{display: 'block', marginLeft: 10, backgroundColor: 'transparent'}}>
                    <SmallBarchart values_arr={display_all[d]['diffs']}/> {/* this.props.compareData.topic_diffs[d]['diffs']}/> */}
                  </div>

                </div>
                </li>)}
              </div>)}
        </CardText>
      </div>
    </Card>
  )
}}

const CheckboxComponent = (props) => {
  const handleCheck = (e, value) =>{
    props.handleCheck(e, value)
  }
  return <div style={{display: 'inline-block'}}>
          <Checkbox onCheck={handleCheck}
              label={props.label}
              labelPosition='right'
              labelStyle={{color: props.fill, minWidth: 80, fontSize: 12, fontWeight: 'bold'}}
              value={props.value}
              checked={props.checked}
              />
        </div>
}

const CustomTooltip = (props) => {
  const { active } = props;
  const { payload } = props;
  if (active) {
  //console.log('payload', payload)
  return (
      <div style={{backgroundColor: '#f5f5f5', opacity: 0.8, padding: 5, borderRadius: 5}}>
        {payload.map((p,i)=>{
          let name = payload[i].name;
          return <p key={`p-${i}`} style={{color: payload[i].fill, margin: 2}}>{`${name}: ${Math.round(payload[i].payload[name])}%`}</p>
        })
      }
      </div>
    );
  }
  return null;
};

const MatchBarchart = observer(({ compareData }) => {
  let totalCount = 0;
  compareData.difference_distances.map((diff) => totalCount += diff);
  let diffs = compareData.difference_distances;
  let values = {
    strongly_agree: Math.round(1000*(diffs[0])/ totalCount)/10,
    agree: Math.round(1000*(diffs[1])/ totalCount)/10,
    neutral: Math.round(1000 *(diffs[2]) / totalCount)/10,
    disagree: Math.round(1000 *(diffs[3]) / totalCount)/10,
    strongly_disagree: Math.round(1000*(diffs[4])/ totalCount)/10
  };

  return (
    <ResponsiveContainer minHeight={30} maxWidth={150} style={{border: '1px solid red'}}>
    <BarChart
      layout="vertical"
      data={[values]}
      barGap={1}
    >
      <XAxis domain={[0, 100]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_disagree" stackId="1" fill={labels[Object.keys(values)[4]]['color']} />
      <Bar dataKey="disagree" stackId="1" fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="neutral" stackId="1" fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="agree" stackId="1" fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="strongly_agree" stackId="1" fill={labels[Object.keys(values)[0]]['color']} />
      <Tooltip content={<CustomTooltip/>}/>
    </BarChart>
  </ResponsiveContainer>
)
})

const SmallBarchart = (props) => {

  let values = {
    strongly_agree: props.values_arr[0],
    agree: props.values_arr[1],
    neutral: props.values_arr[2],
    disagree: props.values_arr[3],
    strongly_disagree: props.values_arr[4]
  };
  return (
    <ResponsiveContainer minHeight={20} maxWidth={150}>
    <BarChart
      layout="vertical"
      barGap={1}
      data={[values]}
    >
      <XAxis domain={[0, 4]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_disagree" stackId='1' fill={labels[Object.keys(values)[4]]['color']} />
      <Bar dataKey="disagree" stackId='1' fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="neutral" stackId='1' fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="agree" stackId='1' fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="strongly_agree" stackId='1' fill={labels[Object.keys(values)[0]]['color']} />
    </BarChart>
  </ResponsiveContainer>
)
}

const SignInToSeeView = () => {
  return (<div className="sign-in-to-see">
    Sign in to compare your answers to other users
  </div>)
}

export default CompareCollectionUsers;
