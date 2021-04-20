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

class AMRAPScreen extends Component {
  state = {
    alerts: [0, 15],
    countDown: 1,
    time: '2',
    paused: false,
    isRunning: false,
    countDownValue: 0,
    count: 0,
    repetitions: 0
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
    //clearInterval(this.countDownTimer)
    //clearInterval(this.countTimer)
    this.setState({
      paused: !this.state.paused
    })
  }
  
  play = () => {
    this.setState({
      paused: false,
      repetitions: 0,
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

  decrement = () => {
    if(this.state.repetitions > 0){
      this.setState({
        repetitions: this.state.repetitions - 1
      })
    }
  }

  increment = () => {
    this.setState({
      repetitions: this.state.repetitions + 1
    })
  }

  render(){
    if(this.state.isRunning){
      const percMinute = parseInt(((this.state.count % 60) / 60)*100)
      const percTime = parseInt(((this.state.count)/60 / parseInt(this.state.time))*100)
      const media = this.state.repetitions > 0 ? this.state.count / this.state.repetitions : 0
      const estimated = media > 0 ? Math.floor((parseInt(this.state.time)*60)/media) : 0
      const opacity = !this.state.paused ? 0.6 : 1
      return(
        <BackgroundProgress percentage={percMinute}>
          <View style={{flex: 1, justifyContent: 'center'}}>   
            <View style={{flex: 1}}>
              <Title 
                title='AMRAP' 
                subTitle='As Many Repetitions As Possible' 
                style={{paddingTop: 100}}/>  
            </View> 
            {this.state.repetitions > 0 ? 
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Time time={media} type='text3'/>
                  <Text style={styles.subTitle}>Por repetição</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.count}>{estimated}</Text>
                  <Text style={styles.subTitle}>repetições</Text>
                </View>
              </View> 
              :
              null
            }

            <View style={{flex: 1, justifyContent: 'center'}}>
              <Time time = {this.state.count} />
                <ProgressBar percentage={percTime}/>
              <Time time = {parseInt(this.state.time)*60-this.state.count} type='text2' appendedText={' restantes'}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {
                this.state.countDownValue > 0 ?
                <Text style={styles.countdown}>{this.state.countDownValue}</Text>  
                :
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                  <TouchableOpacity onPress={this.decrement}>
                    <Text style={styles.countdown}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.countdown}>{this.state.repetitions}</Text>
                  <TouchableOpacity onPress={this.increment}>
                    <Text style={styles.countdown}>+</Text>
                  </TouchableOpacity>
                </View>
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
          title='AMRAP' 
          subTitle='As Many Repetitions As Possible' 
          style={{paddingTop: 10}}/>  

        <Image style={{ alignSelf: 'center'}} source={require('../../assets/btn-engrenagem.png')}/>
        
        <Select 
          label='Alertas:'
          current={this.state.alerts}
          options={[
            {id: 0,  label: '0s'}, 
            {id: 15, label: '15s'}, 
            {id: 30, label: '30s'}, 
            {id: 45, label: '45s'}]}
          onSelect={opt => this.setState({alerts: opt})}/>

        <Select 
          label='Contagem Regressiva:'
          current={this.state.countDown}
          options={[{id: 1, label: 'sim'}, {id: 0, label: 'não'}]}
          onSelect={opt => this.setState({countDown: opt})}/>

        <Text style={styles.label}>Quantos minutos:</Text>
        <TextInput style={styles.input} keyboardType='numeric' value={this.state.time} onChangeText={text => this.setState({time: text})}/>
        <Text style={styles.label}>minutos</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.back()}>
            <Image source={require('../../assets/backarrow.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignSelf: 'center'}} onPress={()=> this.play()}>
            <Image source={require('../../assets/btn-play.png')}/>
          </TouchableOpacity>        
        </View>
        <Text>Testar</Text>
      </KeyboardAwareScrollView>
    
    )
  }
}

AMRAPScreen.navigationOptions = {
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
  },
  count: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 11,
    textAlign: 'center'
  }
})

export default AMRAPScreen