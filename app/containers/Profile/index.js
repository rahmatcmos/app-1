import React, { Component } from 'react';
import {
  Container,
  Content,
  Form,
  List,
  ListItem,
  Picker,
  Label,
  Input,
  Text,
  Title
} from 'native-base';
import { View, StyleSheet, Alert, Image, KeyboardAvoidingView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

// import redux componens
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import InputItem from '../../components/InputItem';
import Button from '../../components/Button'
import Header from '../../components/Header';
import styles from './styles';

import * as actions from './actions';
import * as selectors from './selectors';

class Profile extends Component {
  componentWillMount() {
    if (this.props.profileData) {
      this.handleInputChange('username', this.props.profileData.username)
      this.handleInputChange('firstName', this.props.profileData.first_name)
      this.handleInputChange('lastName', this.props.profileData.last_name)

      if (this.props.profileData.url || this.props.profileData.url === '') {
        this.handleInputChange('profilePic', 'https://museum.wales/media/40374/thumb_480/empty-profile-grey.jpg')
      } else {
        this.handleInputChange('profilePic', this.props.profileData.url)
      }
    }
  }

  handleInputChange = (field, value) => {
    this.props.updateFields(field, value);
  }

  render() {
    // destructure state
    const { fields, isProfileUpdated } = this.props || {};
    const {
      firstName,
      lastName,
      username,
      profilePic
    } = fields || '';

    if (isProfileUpdated) {
      Alert.alert('Success', 'Profile changed');
      this.props.updateIsProfileUpdated(false)
    }

    return (
      <Container>
        <Header
          title="PROFILE"
        >
          <View style={styles.section1}>
            <Image
              source={{ uri: profilePic }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </Header>
        <Content>
          <View style={styles.section3}>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.section2}>
            <InputItem
              title="First Name"
              onChangeText={(text) => { this.handleInputChange('firstName', text) }}
              value={firstName}
            />
            <InputItem
              title="Last Name"
              onChangeText={(text) => {this.handleInputChange('lastName', text)}}
              value={lastName}
            />
            <Button block light style={styles.button} onPress={() => { Actions.changePassword(); }}>
              <Text>Change Password</Text>
            </Button>
            <Button
              block
              disabled={ this.props.firstName === '' ? true : false }
              style={styles.button}
              onPress={() => this.props.changeProfile()}
            >
              <Text>Save changes</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

/**
 *  Map redux state to component props
 */
const mapStateToProps = createStructuredSelector({
  fields: selectors.getFields(),
  isProfileUpdated: selectors.getIsProfileUpdated()
});

export default connect(mapStateToProps, actions)(Profile);
