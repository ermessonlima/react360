import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  asset,
  Environment,
} from 'react-360';
import EventEmitter from "EventEmitter";
import MediaAppTemplateScenePage from "MediaAppTemplateScenePage.react";
import MediaAppTemplateSubtitleText from "MediaAppTemplateSubtitleText.react";

// The mock database
const SCENE_DEF = [
  {
    type: 'photo',
    title: 'Mudar',
    source: asset('SAM_100_0021.jpg'),
    audio: asset('cafe.wav'),
    next: 1,
    subtitle: 'This is the welcome scene, just look around!',
  },
  {
    type: 'photo',
    title: 'Welcome Scene',
    source: asset('SAM_100_0023.jpg'),
    audio: asset('cafe.wav'),
    next: 2,
    subtitle: 'This is the welcome scene, just look around!',
  },
  {
    type: 'photo',
    title: '2D Street View',
    source: asset('SAM_100_0025.jpg'),
    screen: {url: asset('video.mp4').uri},
    next: 0,
    subtitle: 'This is a 2d video of street view, you can see the traffic.',
  },
];

// To share data between different root views, the best way is to
// use data frameworks such as flux or redux.
// Here we just use a simple event emitter.
const dataStore = new EventEmitter();

// The root react component of the app main surface
export default class MediaAppTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  _onClickNext = () => {
    const nextID = SCENE_DEF[this.state.index].next;
    this.setState({index: nextID});
    dataStore.emit('dataChange', nextID);
  };

  render() {
    const currentScene = SCENE_DEF[this.state.index];
    const nextScene = SCENE_DEF[SCENE_DEF[this.state.index].next];
    return (
      <View style={styles.panel}>
        <MediaAppTemplateScenePage
          currentScene={currentScene}
          nextScene={nextScene}
          onClickNext={this._onClickNext} />
      </View>
    );
  }
};

// The root react component of the subtitle surface
export class MediaAppTemplateSubtitle extends React.Component {
  state = {
    index: 0,
  };

  componentWillMount() {
    dataStore.addListener('dataChange', this._onDataChange);
  }
  componentWillUnmount() {
    dataStore.removeListener('dataChange', this._onDataChange);
  }
  _onDataChange = (index) => {
    this.setState({index: index});
  };
  render() {
    const currentScene = SCENE_DEF[this.state.index];
    return (
      <View style={styles.subtitle}>
        <MediaAppTemplateSubtitleText text={currentScene.subtitle} />
      </View>
    );
  }
};

// defining StyleSheet
const styles = StyleSheet.create({
  panel: {
    width: 700,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 300,
  },
});

// register the root component
// this will be used from client.js by r360.createRoot('MediaAppTemplate' ...)
AppRegistry.registerComponent('MediaAppTemplate', () => MediaAppTemplate);

// register another root component
// this will be used from client.js by r360.createRoot('MediaAppTemplate' ...)
AppRegistry.registerComponent('MediaAppTemplateSubtitle', () => MediaAppTemplateSubtitle);