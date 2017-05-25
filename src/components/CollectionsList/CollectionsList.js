import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';
import {Helmet} from "react-helmet";
//import smallLogo from './represent_white_outline.svg';

import './CollectionsList.css';

 

const CollectionsList = inject("CollectionStore")(observer(({ CollectionStore }) => {

  if (CollectionStore.collections.size <= 0) {
    return null;
  }

  let collections = CollectionStore.collections.entries();

  return (
    <div>
      <div><CollectionSearch /></div>
      <div className='containerStyles'>
      {collections.map((collection_obj) => {
        const id = collection_obj[0];
        const collection = collection_obj[1];
        //console.log(collection);
        const first_name = collection.user.first_name ? collection.user.first_name : '';
        const last_name = collection.user.last_name ? collection.user.last_name : '';
        const user_name = `${first_name} ${last_name}`;
        const bio = collection.user.bio ? collection.user.bio : '';
        const location = collection.user.country_info ? collection.user.country_info.name : '';
        const randomPic = `./img/pic${Math.floor(Math.random()*7)}.png`;
        const photo = collection.user.photo ? collection.user.photo.replace("localhost:8000", "represent.me") : randomPic;
        const image = collection.photo ? collection.photo.replace("localhost:8000", "represent.me") : null;
        //const link = "https://app.represent.me/profile/" + collection.user.id + "/" + collection.user.username; //our user
        const subtitle = `${bio.substring(0, location ? 77-location.length : 77)}${bio && '...'} ${location}`

        return (

            <Card className='cardStyles' key={ id }>

            <Link to={ "/survey/" + id } >
               {/* <CardHeader
                    title={user_name}
                    subtitle={subtitle}
                    avatar={photo}
                    className='cardHeaderStyle'
                />
              */}

                <CardMedia>
                  <img src={image} className='imgStyle'/>
                </CardMedia>
                <CardTitle
                  className='cardTitle'
                  title={ collection.name }
                />
              </Link>
              <CardText style={{wordWrap: 'break-word'}} className='cardText'>
              {collection.desc ?
                <div>
                  {collection.desc.slice(0, 100 + collection.desc.indexOf(' ')) + ' '}
                  <Link to={ "/survey/" + id }><i>more...</i></Link>
                </div>
                : null}
              </CardText>

              <CardActions>
                <Link to={ "/survey/" + id }>
                  <FlatButton label="Start" primary />
                 </Link>
              </CardActions>

            </Card>

        )
      })}
      </div>
      <OgTags />
    </div>
  );
}))

const OgTags = ({}) => {
  const og = {
    url: `https://openv2.represent.me/`,
    title: "Represent: Democracy as it should be. Survey",
    image: 'https://represent.me/assets/img/ogimage.jpg',
    desc: "We’re modernising democracy. Join the Heard."
  }
  return (<Helmet>
    <meta property="og:url" content={og.url} />
    <meta property="og:title" content={og.title} />
    <meta property="og:image" content={og.image} />
    <meta property="og:description" content={og.desc} />
  </Helmet>)
}

export default CollectionsList;
