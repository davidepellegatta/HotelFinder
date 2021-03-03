import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NativeModules} from 'react-native';
import {Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';

let HotelFinderNative = NativeModules.HotelFinderNative;

export default class Bookmarks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkDocuments: [],
    };
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  componentDidAppear() {
    this.queryBookmarkDocuments();
  }

  componentDidDisappear() {
    this.setState({bookmarkDocuments: []});
  }

  queryBookmarkDocuments() {
    HotelFinderNative.queryBookmarkDocuments(
      (err) => {
        console.log(err);
      },
      (bookmarks) => {
        this.setState({bookmarkDocuments: bookmarks});
      },
    );
  }

  forgetHotel = (rowMap, data) => {
    console.log('forget: ' + data.item.id);
    HotelFinderNative.unbookmark(
      data.item.id,
      (err) => {
        console.log(err);
      },
      (hotels) => {
        this.queryBookmarkDocuments();
      },
    );
    this.closeRow(rowMap, data);
  };

  renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
        <Text
          style={styles.backTextWhite}
          rowMap={rowMap}
          data={data}
          onPress={() => this.forgetHotel(rowMap, data)}>
          Forget :(
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => this.closeRow(rowMap, data)}
        rowKey={data}
        rowMap={rowMap}>
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  closeRow = (rowMap, data) => {
    if (rowMap[data.item.id]) {
      rowMap[data.item.id].closeRow();
    }
  };

  renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{data.item.name}</Text>
        <Text style={styles.title}>{data.item.phone}</Text>
        <Text style={styles.title}>{data.item.address}</Text>
      </View>
    );
  }

  render() {
    let view;

    if (this.state.bookmarkDocuments.length === 0) {
      view = <Text>Start bookmarking your fav hotels</Text>;
    } else {
      view = (
        <SwipeListView
          data={this.state.bookmarkDocuments}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          keyExtractor={(item) => item.id}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {view}
        <FindHotelButton {...this.props} />
      </SafeAreaView>
    );
  }
}

const FindHotelButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.addBookmark}
      onPress={() =>
        Navigation.push(props.componentId, {
          component: {
            name: 'HotelSearch',
            options: {
              topBar: {
                title: {
                  text: 'Search Hotels',
                },
              },
            },
          },
        })
      }>
      <Icon name="hotel" size={30} color="#313236" />
    </TouchableOpacity>
  );
};

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    backgroundColor: 'whitesmoke',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  listView: {
    flex: 1,
  },
  searchBar: {
    flex: 1,
    width: '100%',
  },
  searchInputStyle: {
    backgroundColor: 'white',
    color: 'black',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginVertical: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  addBookmark: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 25,
    right: 10,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
});
