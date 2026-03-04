import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HeroGallery from './components/HeroGallery';

function App(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <HeroGallery />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
