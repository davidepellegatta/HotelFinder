/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import Bookmarks from './ui/Bookmarks';
import HotelSearch from './ui/HotelSearch';

Navigation.registerComponent('Bookmarks', () => Bookmarks);
Navigation.registerComponent('HotelSearch', () => HotelSearch);

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a',
  },
  topBar: {
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: '#4d089a',
    },
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Bookmarks',
              id: 'HOME',
              options: {
                // Optional options object to configure the screen
                topBar: {
                  title: {
                    text: 'Bookmarked Hotels', // Set the TopBar title of the new Screen
                  },
                },
              },
            },
          },
        ],
      },
    },
  });
});
