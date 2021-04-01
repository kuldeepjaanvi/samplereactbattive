
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView,ScrollView, View, Text, StyleSheet,Linking,Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux'

import * as api from "../../api";
import {addHeadlines} from "../../actions";
import Article from "../../utils";

import Panel from '../../components/Panel'
import PanelItem from '../../components/PanelItem'
import { FloatingAction } from "react-native-floating-action";
import { StatusBar } from 'react-native';
export default function DashBoard(props) {
    const dispatch = useDispatch();
    const {navigate} = props.navigation;

    //1 - DECLARE VARIABLES
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    //Access Redux Store State
    const newsReducer = useSelector(({newsReducer}) => newsReducer);
    const {business, entertainment, general, health, science, sports, technology} = newsReducer;

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        getData();
    }, []);

    //==================================================================================================

    //3 - GET DATA
    async function getData() {
        setIsFetching(true);

        try {
            let data = await api.getHeadlines();
            dispatch(addHeadlines(data))
        } catch (error) {
            setError(error);
        } finally {
            setIsFetching(false)
        }
    }

    //==================================================================================================

    //4 - RENDER NEWS ITEM - A function that returns a function
    const renderItem = (size = 'small', horizontal = false, grid = false, wrapper = true) => {
        return ({item, index}) => {
            let article = new Article(item, navigate);
            return <PanelItem {...article} size={size} horizontal={horizontal} grid={grid} wrapper={wrapper}/>
        };
    };

    //==================================================================================================

    //5 - ON CTA PRESS
    const onCTAPress = (category) => navigate("Articles", {category});

    //==================================================================================================

    //6 - RENDER
    if (isFetching) return <ActivityIndicator style={{paddingVertical: 8}}/>;
    if (error){
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize: 16}}>
                    {`${error.message}`}
                </Text>
                <Text style={{color: "blue", fontSize: 16, padding: 8}} onPress={getData}>Tap to retry</Text>
            </View>
        );
    }

    let renderDefaultItem = renderItem();
    let renderHorizontalItem = renderItem(null, true, false, true);

    let renderGridItem = renderItem('small', false, true, false);
    let renderHorizontalGridItem = renderItem(null, true, true, false);

    let renderSportItem = renderItem('large');
    let renderTechItem = renderItem('large', false, true);
    const actions = [
        // {
        //   text: "Accessibility",
        //   icon: require('./ic_accessibility_white.png'),
        //   name: "bt_accessibility",
        //   position: 2
        // },
        // {
        //   text: "Language",
        //   icon: require("./ic_language_white.png"),
        //   name: "bt_language",
        //   position: 1
        // },
        {
          text: "REQUEST SERVICE",
          icon: require("./submitAnswer.png"),
          name: "bt_SignUp",
          position: 3
        },
        {
          text: "WhatsApp",
          icon: require("./whatsup.png"),
          name: "bt_WhatsApp",
          position: 4
        },
        {
          text: "Apply For Jobs",
          icon: require("./whatsup.png"),
          name: "bt_WhatsApp",
          position: 4
        }
      ];
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <StatusBar backgroundColor='#246600' barStyle="light-content" />
        <ScrollView style={{backgroundColor: "#fff"}}>

        <Panel title={"Our Offers"}
                   data={technology.articles.slice(0, 2)}
                   renderItem={renderSportItem}
                   onCTAPress={() => onCTAPress("Sports")}/>

        <Panel cols={4}
                   title={"Our Services"}
                   data={technology.articles.slice(2, 6)}
                   renderItem={renderGridItem}
                   showDivider={false}
                   onCTAPress={() => onCTAPress("Health")}/>

            <Panel title={"Tel Consultation"}
                   data={technology.articles.slice(6, 8)}
                   renderItem={renderDefaultItem}
                   onCTAPress={() => onCTAPress("Business")}/>
            
            <Panel title={"Hospitals"}
                   data={technology.articles.slice(8, 10)}
                   renderItem={renderDefaultItem}
                   onCTAPress={() => onCTAPress("Science")}/>

            <Panel cols={1}
                   title={"Health Tips"}
                   data={technology.articles.slice(10, 12)}
                   renderItem={renderTechItem}
                   showDivider={false}
                   onCTAPress={() => onCTAPress("Technology")}/>
        </ScrollView>
        <FloatingAction
            position="right"
            actions={actions}
            onPressItem={name => {
                if(name == "bt_WhatsApp") {
                    sendOnWhatsApp()
                } else if (name == "bt_SignUp"){
                  //navigate('SecondScreen', { user: 'Lucy' })
                  navigate("Article", {title: "Please submit your answer", article: {url:"https://forms.gle/MqxNxaDqYVDpWCM26",title:"title"}})             
       //Alert.alert("Icon pressed", `the icon ${name} was pressed`);

                }
              //Alert.alert("Icon pressed", `the icon ${name} was pressed`);
            }}
          />
          
        </View>
      </SafeAreaView>
    );
    
};

sendOnWhatsApp=() => {
    let msg = "";
    let mobile = 9584212143;
    if(mobile){
        let url = 'whatsapp://send?text=' + msg + '&phone=91' + mobile;
        Linking.openURL(url).then((data) => {
          console.log('WhatsApp Opened');
        }).catch(() => {
          alert('Make sure Whatsapp installed on your device');
        });
      
    }else{
      alert('Please insert mobile no');
    }
  }
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      
    }
  });
  
DashBoard.navigationOptions = ({navigation}) => {
    return {title: `Soni Home HealthCare`,
  }
};