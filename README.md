## Couchbase Lite demo with React Native

This project is mentioned to showcase the integration between RN and Couchbase Lite. At the current state is available only
the android implementation but stay tuned: ios is coming as well.

### What you can find here

In this project you can see: 

* how to run your app with a preloaded db
* How to use Full Text Search indexes
* How to run joins and expressive queries

### Steps to run

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

