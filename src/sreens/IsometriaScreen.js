import React, {Component} from 'react'
import {
  View,
  keyboard,
  ScrollView, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput,
  KeyboardAvoidingView} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import Sound from 'react-native-sound'

////////////////////////////////////////////////////////////////////////////////
const alert = require('../../assets/sounds/alert.wav')

class IsometriaScreen extends Component {
  state = {
    goal: 1,
    countDown: 1,
    time: '20',
    isRunning: false,
    paused: false,
    countDownValue: 0,
    count: 0
  }

  componentDidMount(){
    Sound.setCategory('Playback', true)
    this.alert = new Sound(alert)
    //this.play()
  }

  playAlert = () => {   
    const resto = 0
    const { count, time } = this.state
    if(count >= parseInt(time)-5 && count <= parseInt(time)){
      this.alert.play()
      }
    }
  
  /*
  componentWillUnmount(){    
  }*/

  /*if(this.state.count === parseInt(this.state.time)){
          clearInterval(this.countTimer)
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
      count: 0,
      countDownValue: 5,
      paused: false
    })
    this.setState({isRunning: true})
    const count = () => {
      if(this.state.paused){
        return
      }
      this.setState({count: this.state.count + 1}, () => {
        this.playAlert()            
      })
    }
    
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
  }

  render(){
    if(this.state.isRunning){
      const percMinute = parseInt(((this.state.count) / parseInt(this.state.time))*100)
      //const percTime = parseInt(((this.state.count)/60 / parseInt(this.state.time))*100)
      const restante = parseInt(this.state.time)>=this.state.count ? parseInt(this.state.time)-this.state.count : 0
      const opacity = !this.state.paused ? 0.2 : 1
      return(
        <BackgroundProgress percentage={percMinute}>
          <View style={{flex: 1, justifyContent: 'center'}}>   
            <View style={{flex: 1}}>
              <Title 
                title='ISOMETRIA'  
                style={{paddingTop: 100}}/>  
            </View>        
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Time time = {this.state.count} />
              <Time time = {restante} type='text2' appendedText={' restantes'}/> 
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
    return(      
      <KeyboardAwareScrollView style={styles.container}>      
        <Title 
          title='ISOMETRIA' 
          style={{paddingTop: 10}}/>  

        <Image style={{ alignSelf: 'center'}} source={require('../../assets/btn-engrenagem.png')}/>
        
        <Select 
          label='Objetivo:'
          current={this.state.goal}
          options={[
            {id: 0,  label: 'livre'}, 
            {id: 1, label: 'bater tempo'}
          ]}
          onSelect={opt => this.setState({goal: opt})}/>

        <Text style={styles.label}>Quantos segundos:</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={this.state.time} onChangeText={text => this.setState({time: text})}/>
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

IsometriaScreen.navigationOptions = {
  header: null
}
////////////////////////////////////////////////////////////////////////////////
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

export default IsometriaScreen