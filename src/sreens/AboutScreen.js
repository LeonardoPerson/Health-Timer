import React from 'react' 
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'

const AboutScreen = props => {
  const back = () => {
    props.navigation.goBack()
  }

  return(
    <View style={styles.container}>
      <Text style={styles.logo}>Health Timer</Text>
      <View style={styles.containerNexted}>
        <Text style={styles.description}>
          This app was built the goal of timing physical activities.
        </Text>
        <Text style={styles.description}>
          EMON - it's a simple minute counter.
        </Text>
        <Text style={styles.description}>
          AMRAP - The goal is to count minutes with repetitions.
        </Text>
        <Text style={styles.description}>
          Isometria - It's a simple seconds count.
        </Text>
      </View>
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
  containerNexted: {
    alignItems: 'flex-start',
  },
  description: {
    fontFamily: 'Ubuntu-regular',
    fontSize: 20,
    textAlign: 'left',
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