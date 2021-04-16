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
  stop = () => {
    clearInterval(this.countDownTimer)
    clearInterval(this.countTimer)
    this.setState({
      isRunning: false
    })
  }
  
  play = () => {
    this.setState({
      count: 0,
      countDownValue: this.state.countDown === 1 ? 5 : 0
    })
    this.setState({isRunning: true})
    const count = () => {
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
      repetitions: this.state.repetitions - 1
    })
  }

  render(){
    if(this.state.isRunning){
      const percMinute = parseInt(((this.state.count % 60) / 60)*100)
      const percTime = parseInt(((this.state.count)/60 / parseInt(this.state.time))*100)
      return(
        <BackgroundProgress percentage={percMinute}>
          <View style={{flex: 1, justifyContent: 'center'}}>   
            <View style={{flex: 1}}>
              <Title 
                title='AMRAP' 
                subTitle='As Many Repetitions As Possible' 
                style={{paddingTop: 100}}/>  
            </View>        
            <View>
              <Time time={10} type='text2'/>
              <Text>Por repetição</Text>
            </View>
            <View>
              <Text>10</Text>
              <Text>Por repetição</Text>
            </View>
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
              
              <TouchableOpacity style={{ alignSelf: 'center', alignContent: 'flex-end'}} onPress={()=> this.stop()}>
                <Image source={require('../../assets/btn-stop.png')}/>
              </TouchableOpacity>
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
        <TouchableOpacity style={{ alignSelf: 'center'}} onPress={()=> this.play()}>
          <Image source={require('../../assets/btn-play.png')}/>
        </TouchableOpacity>
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
  }
})

export default AMRAPScreen