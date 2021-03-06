import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import IntroCarouselCard from './IntroCarouselCard';
import './IntroCarousel.css';



class IntroCarousel extends React.Component {
  state = {
    items: [
      {id: 0, backgroundColor: '#1B8AAE', title: 'Welcome!', subtitle: "Let's take a quick tour so you get the most out of Represent.", img: '', headerText: "", text0: "", button: null},
      {id: 1, backgroundColor: '#1B8AAE', title: "", subtitle: "",  headerText: " ", text: "Our mission together is to modernise democracy and help you guide representatives to make wise and informed decisions. ", button: null},
      {id: 2, backgroundColor: '#1B8AAE', title: "It's really simple ", subtitle: "One vote every 5 years isn't enough to represent you. Represent lets you vote on issues you care about, and anonymously publishes maps and graphs to show your MP what constituents want.",  headerText: " ", text: "", button: null},
      {id: 3, backgroundColor: '#1B8AAE', title: "Evidence-led decisions", subtitle: "Maps, demographics, consensus.. it's all here", img:'intro_answer.png', headerText: " ", text: "", button: null},
      {id: 4, backgroundColor: '#1B8AAE', title: 'Vote directly from Facebook Messenger', subtitle: "Or use it contact your MP or local authority", img: 'messenger.png', headerText: "", text: "", button: null},
      {id: 5, backgroundColor: '#1B8AAE', title: "Track and guide your MP", subtitle: "Vote on the same issues your MP does, and get updates when they vote",  headerText: " ", text: "", button: null},
      {id: 6, backgroundColor: '#1B8AAE', title: 'Copy votes of people you trust', subtitle: "", img: '', headerText: "", text: "You don't have to know about everything - you can find and copy the votes of people you trust on any issue.", button: null},
      {id: 7, backgroundColor: '#1B8AAE', title: 'Your data is safe', subtitle: "", img: '', headerText: "", text: "You can also edit your settings to make all your answers private — (though you will lose the ability to compare yourself if you do this!)", button: null},
      {id: 8, backgroundColor: '#1B8AAE', title: 'Compare and share', subtitle: "", img: 'compare.png', headerText: "", text: "", button: null},
      {id: 9, backgroundColor: '#1B8AAE', title: 'Any more questions?', subtitle: "", img: '', headerText: "", text: "Drop us a line at hello@represent.me or tweet @representlive!", button: null},
      ],
    //modalOpened: true,
    step: 0
  }

  closeModal = (e) => {
    e.preventDefault();
    this.setState({step: 0})
    this.props.toggleIntro();
  }
  navigateNext = (e) => {
    e.preventDefault();
    let step = this.state.step + 1;
    this.setState({step})

  }

  render (){
    const modalOpened = this.props.modalOpened;
    const item = this.state.items.filter(item => item.id === this.state.step)[0]
    const actions = item.id !== (this.state.items.length - 1) ? [
       <FlatButton
         label="Close"
         onTouchTap={(e)=>this.closeModal(e)}
       />,
       <FlatButton
         label="Next"
         primary={true}
         onTouchTap={(e)=>this.navigateNext(e)}
       />,
       ] : [
        <FlatButton
          label="Close"
          onTouchTap={(e)=>this.closeModal(e)}
        />
      ]
       ;
    return (

      <Dialog
        open={modalOpened}
        actions={actions}
        autoScrollBodyContent={true}
        className="introslides"
        contentClassName="introslidesBody"
        bodyStyle={{backgroundColor: item.backgroundColor}}
        >
        <div>
          <div key={`slide-${this.state.step}`} >
            <IntroCarouselCard
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              img={item.img}
              headerText={item.headerText}
              text0={item.text0}
              text={item.text}
              backgroundColor={item.backgroundColor}
              //removeCard={this.removeCard}
            />
          </div>

          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
