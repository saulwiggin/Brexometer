import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import MessengerPlugin from 'react-messenger-plugin';
import { FacebookButton, TwitterButton } from "react-social";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import CodeTags from 'material-ui-community-icons/icons/code-tags';
import IconButton from 'material-ui/IconButton';
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';

import QuestionPopulationStackedChart from '../charts/QuestionPopulationStackedChart';
import CompareCollectionUsers from '../CompareCollectionUsers'
import DynamicConfigService from '../../services/DynamicConfigService'

import './CollectionEnd.css';
import FacebookImg from './iconmonstr-facebook-5.svg';
import TwitterImg from './iconmonstr-twitter-5.svg';

const questionShareLink = (questionId) => {
  if(window.self !== window.top) { // In iframe
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(document.referrer);
  }else { // Top level
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(location.href);
  }
}

const FacebookShareButton = (props) => (
  <FacebookButton appId={window.authSettings.facebookId} element="span" url={props.url}>
    <img src={FacebookImg} />
  </FacebookButton>
)

const TwitterShareButton = (props) => (
  <TwitterButton appId={window.authSettings.facebookId} element="span" url={props.url}>
    <img src={TwitterImg} />
  </TwitterButton>
)


const styles = {

};

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class CollectionEnd extends Component {

  constructor() {
    super();

    this.state = {
      showMessengerDialog: true,
    }

  }

  componentWillMount() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.items(collectionId); // Buffers the questions
    }

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }

    this.setState({
      showMessengerDialog: this.dynamicConfig.config.survey_end.messenger_prompt
    })

    this.props.CollectionStore.items(collectionId);
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let collection = this.props.CollectionStore.collections.get(collectionId);

    if(!collection) {
      return null;
    }

    let cardMediaCSS = {
      background: "linear-gradient(135deg, rgba(250,255,209,1) 0%,rgba(161,255,206,1) 100%)",
      height: '200px',
      overflow: 'hidden',
      backgroundSize: 'cover',
    }

    if(collection.photo) {
      cardMediaCSS.backgroundImage = 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')';
    }

    let messengerRefData = "get_started_with_token";
    let authToken = this.props.UserStore.getAuthToken();
    if(authToken) {
      messengerRefData += "+auth_token=" + authToken;
    }

    return (
      <div>

        <Card style={{margin: '0'}} zDepth={0}  >
          <CardMedia overlay={<CardTitle title={ collection.name } subtitle={ collection.end_text } />}>
            <div style={cardMediaCSS}></div>
          </CardMedia>
        </Card>

        <CollectionEndUserCompare userIds={this.dynamicConfig.config.survey_end.compare_users} />

        <CollectionEndShare collection={collection} />

        <CollectionEndQuestionPieCharts />

        {false && this.props.CollectionStore.items(collectionId) &&

          <Card style={{margin: '10px', overflow: 'hidden'}}>
            <CardText>
              {this.props.CollectionStore.items(collectionId).map((collectionItem, index) => {
                return (
                  <div className="CollectionEndResult" key={index}>
                    <QuestionPopulationStackedChart questionId={collectionItem.object_id} geoId={59} height={100}/>
                    <p style={{margin: '5px'}}>{this.props.QuestionStore.questions.has(collectionItem.object_id) && this.props.QuestionStore.questions.get(collectionItem.object_id).question}</p>
                    <FacebookShareButton url={questionShareLink(collectionItem.object_id)} /> <TwitterShareButton url={questionShareLink(collectionItem.object_id)} />
                  </div>
                )
              })}
            </CardText>
          </Card>

        }

        <Dialog
            title="Want awesome powers?"
            modal={false}
            open={this.state.showMessengerDialog}
          >
            You can vote directly from facebook messenger, making it easy to have your say in important issues as often as you like. Try it out - we think you’ll love it!<br/><br/>
            <span style={{float: 'left'}}><MessengerPlugin
              appId={String(window.authSettings.facebookId)}
              pageId={String(window.authSettings.facebookPageId)}
              size="xlarge"
              passthroughParams={messengerRefData}
              /></span>
            <span style={{float: 'right'}}><FlatButton label="Continue" style={{marginBottom: '10px'}} onClick={() => this.setState({showMessengerDialog: false})} /></span>

        </Dialog>

      </div>
    );

  }

  getQuestionShareLink() {

  }

}

class CollectionEndShare extends Component {

  constructor() {
    super()
    this.state = {
      showEmbedDialog: false
    }
  }

  render() {
    return (
      <div style={{float: 'left', width: '50%', padding: '10px', boxSizing: 'border-box'}}>
        <Card containerStyle={{padding: 0}}>
          <CardText style={{textAlign: 'center', padding: 0}}>

            <FacebookButton appId={window.authSettings.facebookId} element="span" url={document.referrer}>
            <FlatButton
              label="Share on Facebook"
              fullWidth={true}
              icon={<IconButton style={{padding: 0, height: 'auto'}}><FacebookBox color={indigo500} /></IconButton>}/>
            </FacebookButton>

            <TwitterButton element="span" url={document.referrer}><FlatButton
              href="https://github.com/callemall/material-ui"
              target="_blank"
              label="Share on Twitter"
              fullWidth={true}
              icon={<IconButton style={{padding: 0, height: 'auto'}}><TwitterBox color={blue500} /></IconButton>}/>
            </TwitterButton>

            <FlatButton
              onClick={() => this.setState({showEmbedDialog: true})}
              target="_blank"
              label="Embed this Survey"
              fullWidth={true}
              icon={<IconButton style={{padding: 0, height: 'auto'}}><CodeTags color={bluegrey500} /></IconButton>}/>
          </CardText>
        </Card>
        <Dialog
            title="Embed this on your website"
            modal={false}
            open={this.state.showEmbedDialog}
            actions={
              <FlatButton
                label="Close"
                onTouchTap={() => {
                  this.setState({showEmbedDialog: false});
                }}
              />
            }
          >
          Copy the following HTML into the source of your website, no additional setup required!
          <TextField
            value={'<iframe width="700" height="400" src="https://' + window.location.host + '/survey/' + this.props.collection.id + '"></iframe>'}
            fullWidth={true}
            multiLine={true}
          />

        </Dialog>
      </div>
    )
  }

}

class CollectionEndQuestionPieCharts extends Component {

  render() {
    return (
      <div style={{float: 'left', width: '50%', padding: '10px', boxSizing: 'border-box'}}>
        <Card>
          <CardText>
            <p><i>Pie Charts Here...</i></p>
          </CardText>
        </Card>
      </div>
    )
  }

}

const CollectionEndUserCompare = ({userIds}) => (
  <div style={{float: 'left', width: '50%', padding: '10px', boxSizing: 'border-box'}}>
    <CompareCollectionUsers userIds={userIds} />
  </div>
)

export default CollectionEnd;
