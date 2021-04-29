import React from 'react' 
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'

const AboutScreen = props => {
  const back = () => {
    props.navigation.goBack()
  }

  return(
    <View style={styles.container}>
      <Text style={styles.logo}>Health Timer</Text>
      <Text style={styles.description}>
        This app was built the goal of timing physical activities.
      </Text>
      <TouchableOpacity onPress={back}>
        <Image source={require('../../assets/backarrow.png')}/>
      </TouchableOpacity>
    </View>
  )
}

AboutScreen.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#D6304A',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  description: {
    fontFamily: 'Ubuntu-regular',
    fontSize: 20,
    color: 'white',
    margin: 20
  },
  logo: {
    fontFamily: 'Ubuntu-Bold', 
    fontSize: 48, 
    textAlign: 'center',
    color: 'white',
  }
})

export default AboutScreen