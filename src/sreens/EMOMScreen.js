import React, {Component} from 'react'
import {
  Platform,
  View,
  Text, 
  StyleSheet, 
  Image, 
  TextInput,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import Sound from 'react-native-sound'
import KeepAwake from 'react-native-keep-awake'

const alert = require('../../assets/sounds/alert.wav')

class EMOMScreen extends Component {
  state = {
    alerts: [0, 15],
    countDown: 1,
    time: '2',
    paused: false,
    isRunning: false,
    countDownValue: 0,
    count: 0
  }

  componentDidMount(){
    Sound.setCategory('Playback', true)
    this.alert = new Sound(alert)
    //this.play()
  }

  playAlert = () => {
    const resto = this.state.count % 60
    if(this.state.alerts.indexOf(resto) >= 0){
      this.alert.play()
    }
    if(this.state.countDown === 1){
      if(resto >= 55 && resto < 60){
        this.alert.play()
      }
    }
  }
  
  /*
  componentWillUnmount(){    
  }*/
  
  restart = () => {
    if(this.state.paused){
      clearInterval(this.countTimer)
      clearInterval(this.countDownTimer)
      this.play()
    }    
  }

  back = () => {
    if(this.state.paused || !this.state.isRunning){
      clearInterval(this.countTimer)
      clearInterval(this.countDownTimer)
      this.props.navigation.goBack()
    }
  }

  stop = () => {
    this.setState({
      paused: !this.state.paused
    })
  }
  
  play = () => {
    this.setState({
      paused: false,
      count: 0,
      countDownValue: this.state.countDown === 1 ? 5 : 0
    })
    this.setState({isRunning: true})
    const count = () => {
      if(this.state.paused){
        return
      }
      this.setState({count: this.state.count + 1}, () => {
        this.playAlert()     
        if(this.state.count === parseInt(this.state.time)*60){
          clearInterval(this.countTimer)
        }
      })
    }
    if(this.state.countDown === 1){
      this.alert.play() 
      this.countDownTimer = setInterval(() => {  
        if(this.state.paused){
          return
        }
        this.alert.play()     
        this.setState({countDownValue: this.state.countDownValue - 1}, () => {
          if(this.state.countDownValue === 0){
            clearInterval(this.countDownTimer)
            this.countTimer = setInterval(count, 1000)
          }
        })
      }, 1000)
    }else{
      this.countTimer = setInterval(count, 1000)
    }
  }

  render(){
    if(this.state.isRunning){
      const percMinute = parseInt(((this.state.count % 60) / 60)*100)
      const percTime = parseInt(((this.state.count)/60 / parseInt(this.state.time))*100)
      const opacity = !this.state.paused ? 0.6 : 1
      return(
        <BackgroundProgress percentage={percMinute}>
          <View style={{flex: 1, justifyContent: 'center'}}>  
            <KeepAwake /> 
            <View style={{flex: 1}}>
            <Title 
            title='EMON' 
            subTitle='Every Minute On the Minute' 
            style={{paddingTop: 100}}/>  
            </View>        
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Time time = {this.state.count} />
              <ProgressBar percentage={percTime}/>
              <Time time = {parseInt(this.state.time)*60-this.state.count} type='text2' appendedText={' remaining'}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {
                this.state.countDownValue > 0 ?
                <Text style={styles.countdown}>{this.state.countDownValue}</Text>  
                :
                null
              }
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.back()}>
                  <Image style={{opacity}} source={require('../../assets/backarrow.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.stop()}>
                  {this.state.paused? 
                    <Image source={require('../../assets/btn-play.png')}/>
                    :
                    <Image source={require('../../assets/btn-stop.png')}/>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.restart()}>
                  <Image style={{opacity}} source={require('../../assets/restart2.png')}/>
                </TouchableOpacity>
              </View>
            </View>        
          </View>
        </BackgroundProgress>
      )
      
    }
    const behavior = Platform.OS === 'ios' ? 'height' : 'padding' //'padding'
    const paddingTop = Platform === 'ios'? this.state.keyboardIsVisible ? 20 : 200 : 50
    return(      
      <KeyboardAwareScrollView style={styles.container} behavior={behavior}>      
        <Title 
          title='EMON' 
          subTitle='Every Minute On the Minute' 
          style={{paddingTop}}/>  

        <Image style={{ alignSelf: 'center'}} source={require('../../assets/btn-engrenagem.png')}/>
        
        <Select 
          label='Alerts:'
          current={this.state.alerts}
          options={[
            {id: 0,  label: '0s'}, 
            {id: 15, label: '15s'}, 
            {id: 30, label: '30s'}, 
            {id: 45, label: '45s'}]}
          onSelect={opt => this.setState({alerts: opt})}/>

        <Select 
          label='Countdown:'
          current={this.state.countDown}
          options={[{id: 1, label: 'yes'}, {id: 0, label: 'no'}]}
          onSelect={opt => this.setState({countDown: opt})}/>

        <Text style={styles.label}>How many minutes:</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={this.state.time} onChangeText={text => this.setState({time: text})}/>
        <Text style={styles.label}>minutes</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.back()}>
            <Image source={require('../../assets/backarrow.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignSelf: 'center'}} onPress={()=> this.play()}>
            <Image source={require('../../assets/btn-play.png')}/>
          </TouchableOpacity>        
        </View>
      </KeyboardAwareScrollView>
    
    )
  }
}

EMOMScreen.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#D6304A'
    //paddingTop: 100
  },
    label: {
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Ubuntu-Regular',
      fontSize: 24
  },
    input: {
      textAlign: 'center',
      color: 'black',
      fontFamily: 'Ubuntu-Regular',
      fontSize: 48
  },
    countdown: {
      fontFamily: 'Ubuntu-Bold',
      fontSize: 100,
      color: 'white',
      textAlign: 'center'
  }
})

export default EMOMScreen