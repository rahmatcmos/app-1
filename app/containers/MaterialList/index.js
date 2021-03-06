import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Button,
  Item,
  Input,
  Text,
  Label,
  Card,
  CardItem,
  Body,
  Fab
} from 'native-base';
import { ScrollView, Alert, ActivityIndicator, View, Image, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight, Modal, WebView, Linking } from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import { createStructuredSelector } from 'reselect';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import strings from '../../localization';
import FlagMaterial from './FlagMaterial';
import { getRoleId, getProfileData } from '../../helpers';
import HeaderPoint from '../../components/Header';
import ModalComponent from '../../components/ModalComponent';
import styles from './styles';
import * as selectors from './selectors';
import * as actions from './actions';

const noMaterial = require('./../../../assets/images/nomaterial.png');

class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      invisible: false,
      isLoading: true,
      modalVisible: false,
      roleId: null
    };
  }

  componentWillMount() {
    if (typeof this.props.speakerId === 'undefined'){
      getProfileData()
        .then((profileData) => {
          console.log("profiulenjdfsnakjno", profileData)
          this.props.fetchMaterialList(profileData.speaker.id);
        });
    }
    this.props.fetchMaterialList(this.props.speakerId);
    getRoleId()
      .then((roleId) => {
        this.setState({ roleId });
      });
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps && prevProps.visible && this.props.visible !== prevProps.visible) {
      this.setState({
        visible: prevProps.visible
      });
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getSingleLink(url) {
    this.setModalVisible(true);
    Linking.openURL(url);
  }


  handleInputChange = (field, value) => {
    this.props.updateInputFields(field, value);
  }

  openPicker = () => {
    DocumentPicker.show({
      filetype: [ DocumentPickerUtil.allFiles() ]
    }, (error, res) => {
      this.setState({ fileName: res.fileName });
      this.handleInputChange('file', res);
    });
  }

  saveMaterialList = () => {
    this.props.saveMaterialList(this.props.inputFields);
    this.setState({ invisible: !this.state.invisible });
    Toast.show(strings.material.saved);
    this.setState({ fileName: '' });
  }

  showAlert = (id) => {
    Alert.alert(strings.material.confirm, strings.material.remove,
      [
        { text: strings.global.cancel },
        { text: strings.global.ok, onPress: () => this.removeItem(id) }
      ],
      { cancelable: false }
    );
  }

  removeItem = (id) => {
    this.props.deleteMaterialList(id);
    Toast.show(strings.material.deleted);
  }

  setModal = () => this.setState({ invisible: !this.state.invisible });

  checkButtonBasedOnRole() {
    if (this.state.roleId === 4) {
      return (
        <Button
          block
          rounded
          style={{ marginVertical: 20, alignSelf: 'center', backgroundColor: '#FFA726' }}
          onPress={() => this.setState({ invisible: !this.state.invisible })}
        >
          <Text style={styles.buttonText}>{strings.material.upload}</Text>
        </Button>);
    }
    return (
      <Text style={styles.noMaterialText}>{strings.material.noMaterial}</Text>
    );
  }

  render() {
    const { material, inputFields, speakerId } = this.props;
    const WEBVIEW_REF = 'webview';
    return (
      <ScrollView>
        <Content>
          {this.props.hidden ?
            <View /> :
            <HeaderPoint title={strings.material.title} />
          }
          {
            this.props.isFetching
              ? <ActivityIndicator size="large" color="#f39e21" style={styles.loader} />
              : (
                material && material.length > 0 ?
                  <Content>
                    {material.map((data, key) => (
                      <Card key={data.id}>
                        <CardItem>
                          <Body>
                            <View style={styles.bodySection}>
                              <View style={styles.profileSection}>
                                {this.props.hidden ?
                                  <Icon name="file-pdf-o" style={styles.icons} /> :
                                  <Image
                                    source={{ uri: data.user.photos[0].url || '' }}
                                    style={styles.photo}
                                  />
                                }
                              </View>
                              <View style={styles.nameSection}>
                                {this.props.hidden ?
                                  <View /> :
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.name}>{data.user.first_name} {data.user.last_name}</Text>
                                      <TouchableOpacity onPress={() => this.showAlert(data.id)}>
                                        <Icon name="remove" color="red" style={styles.icon} />
                                    </TouchableOpacity>
                                  </View>
                                }
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{data.title}</Text>
                                    <Text numberOfLines={3} style={styles.summary}>
                                      {data.summary}
                                    </Text>
                                  </View>
                                  {this.props.hidden ?
                                    <View /> :
                                    <FlagMaterial
                                      onPress={() => this.props.updateStatus(data, key)}
                                      isUsed={data.is_used}
                                      id={data.id}
                                    />
                                  }
                                </View>
                                <TouchableOpacity style={styles.buttonDownload} onPress={() => this.getSingleLink(data.material)}>
                                  <Text style={styles.textDownload}>Download</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Body>
                        </CardItem>
                      </Card>
                    ))}
                  </Content> : this.checkButtonBasedOnRole()
              )
          }
          <ModalComponent
            visible={this.state.invisible}
            modalTitle={strings.material.create}
            inputTitle={strings.material.materialTitle}
            onChangeTitle={text => this.handleInputChange('title', text)}
            inputSummary={strings.material.materialSummary}
            onChangeSummary={text => this.handleInputChange('summary', text)}
            onSubmit={this.saveMaterialList}
            onUpload={this.openPicker}
            onModalPress={this.setModal}
            fileName={this.state.fileName}
          />
        </Content>
        {this.state.roleId === 4 ?
          <Fab
            active={this.state.invisible}
            style={{ backgroundColor: '#FFA726' }}
            position="bottomRight"
            onPress={() => this.setModal()}
          >
            <Icon name="plus" />
          </Fab>
          : <View />
        }
      </ScrollView>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  material: selectors.getListMaterial(),
  visible: selectors.getModalStatus(),
  isFetching: selectors.getIsFetchingMaterial(),
  inputFields: selectors.getInputFields()
});
export default connect(mapStateToProps, actions)(MaterialList);
