import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  icon: {
    flex: 1,
    fontSize: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: '#FBFAFA',
    flex: 1
  },
  chatContainer: {
    flex: 1
  },
  commentList: {
    height: height * 0.8
  },
  inputContainer: {
    height: 45,
    bottom: 0,
    flexDirection: 'row'
  },
  textInput: {
    width: 0.90 * width,
    marginRight: -10
  },
  button: {
    width: 30
  },
  btnSend: {
    width: 40 * width
  },
  sendIcon: {
    fontSize: 30,
    color: '#f39e21'
  },
  cardLeft: {
    marginLeft: -5,
    marginTop: -1
  },
  cardRight: {
    marginRight: -5,
    marginTop: -1
  },
  cardLeftContent: {
    backgroundColor: '#f4f5f9'
  },
  cardRightContent: {
    backgroundColor: '#FFE082'
  },
  arrowLeft: {
    marginTop: -1,
    marginRight: -2,
    zIndex: 1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 20,
    borderLeftWidth: 20,
    borderBottomWidth: 10,
    borderTopColor: '#d8d9db',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  arrowLeftTop: {
    marginTop: 0,
    zIndex: 2,
    marginLeft: -15,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 22,
    borderLeftWidth: 20,
    borderBottomWidth: 10,
    borderTopColor: '#f4f5f9',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  arrowRight: {
    marginTop: -1,
    marginLeft: -2,
    zIndex: 1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 10,
    borderTopColor: '#B3E5FC',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  cardContainerLeft: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 3,
    marginRight: width * 0.20
  },
  formStyle: {
    height: 45,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  cardContainerRight: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 3,
    marginLeft: width * 0.20
  }
});
