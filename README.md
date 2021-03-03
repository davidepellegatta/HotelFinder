#Couchbase Lite demo with React Native

This project is mentioned to showcase the integration between RN and Couchbase Lite. At the current state is available only
the android implementation but stay tuned: ios is coming as well.

##Steps to run

Before you run: be sure to have Android Studio installed!

Remember to add to the `android` folder your `local.properties` pointing to your Android SDK location. 
It should look like the following:

```properties
sdk.dir=/Users/your-user/Library/Android/sdk
```
Install the dependencies:

```bash
npm install
```

And finally run the demo: 

```bash
npx react-native run-android
```
