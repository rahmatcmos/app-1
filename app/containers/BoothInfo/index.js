import React, { Component } from 'react';
import {
  Content,
  Text,
  Grid,
  Col
} from 'native-base';
import { View, Alert, Image, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getBoothData } from '../../helpers';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import styles from './styles';
import * as actions from './actions';
import * as selectors from './selectors';

class BoothInfo extends Component {
  state = {
    id: null
  }

  componentWillMount() {
    getBoothData()
      .then((boothData) => {
        if (boothData) {
          console.log('BOOTH DATA', boothData.logo_url);
          this.handleUpdateBoothPhoto(boothData.logo_url);
        }
      });
    AsyncStorage.getItem('role_id')
      .then((roleId) => {
        const id = JSON.parse(roleId);
        this.setState({ id });
      }).catch(() => console.log('Error'));
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.isBoothPhotoUpdated !== this.props.isBoothPhotoUpdated) {
      Alert.alert('Success', 'Booth photo has been changed');
      this.props.updateIsBoothPhotoUpdated(false);
    }
  }

  handleUpdateBoothPhoto = (value) => {
    this.props.updateBoothPhoto(value);
  }

  uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true
    })
      .then((image) => {
        this.props.updateImage(image);
      }).catch(err => console.log('error getting image from library', err));
  }

  render() {
    const booth = this.state.id === 3;
    const { fields, summary, user, boothPhoto } = this.props || {};
    const {
      photoPic
    } = fields || '';
    
    return (
      <ScrollView>
        <Content>
          <LinearGradient
            colors={[ '#f72d48', '#f39e21' ]}
          >
            <Image
              source={boothPhoto === null ? { uri: photoPic } : {uri: boothPhoto}}
              style={styles.boothImage}
              resizeMode={Image.resizeMode.stretch}
            />
            {booth ? <TouchableOpacity style={styles.icon} onPress={() => this.uploadImage(this)}>
              <Icon name={'camera'} size={24} color="#f72d48"/>
            </TouchableOpacity> : <View/>}
            <View style={styles.info}>
              <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          </LinearGradient>
          <Grid style={{ flex: 1 }}>
            <Col style={styles.col1} />
            <Col style={styles.col2} />
            <Col style={styles.col3} />
          </Grid>
          <Grid style={{ flex: 1 }}>
            <Col style={styles.col3} />
            <Col style={styles.col1} />
            <Col style={styles.col2} />
          </Grid>
          <Grid style={{ flex: 1 }}>
            <Col style={styles.col1} />
            <Col style={styles.col2} />
            <Col style={styles.col3} />
          </Grid>
          <Grid style={{ flex: 1 }}>
            <Col style={styles.col3} />
            <Col style={styles.col1} />
            <Col style={styles.col2} />
          </Grid>
        </Content>
      </ScrollView>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fields: selectors.getFields(),
  isBoothPhotoUpdated: selectors.getIsBoothPhotoUpdated(),
  boothPhoto: selectors.getBoothPhoto()
});

export default connect(mapStateToProps, actions)(BoothInfo);
