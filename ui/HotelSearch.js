import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button as ElementsButton, SearchBar} from 'react-native-elements';
import {NativeModules} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Navigation} from 'react-native-navigation';

let HotelFinderNative = NativeModules.HotelFinderNative;

export default class HotelSearch extends React.Component {
  constructor() {
    super();

    this.state = {
      description: '',
      location: '',
      hotels: [],
      bookmarkIds: [],
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
    this.queryBookmarkIds();
  }

  componentDidDisappear() {
    this.setState({hotels: [], bookmarkIds: []});
  }

  queryBookmarkIds() {
    // tag::query-ids[]
    HotelFinderNative.queryBookmarkIds(
      (err) => {
        console.log(err);
      },
      (hotels) => {
        this.setState({bookmarkIds: hotels});
      },
    );
    // end::query-ids[]
  }
  renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{data.item.name}</Text>
        <Text style={styles.title}>{data.item.phone}</Text>
        <Text style={styles.title}>{data.item.address}</Text>
      </View>
    );
  }

  onChangeText(description, location) {
    HotelFinderNative.search(
      description,
      location,
      (err) => {
        console.log(err);
      },
      (hotels) => {
        this.setState({hotels: hotels});
      },
    );
  }
  // eslint-disable-next-line no-undef
  updateDescription = (description) => {
    this.setState({description});
  };
  // eslint-disable-next-line no-undef
  updateLocation = (location) => {
    this.setState({location});
  };

  closeRow = (rowMap, data) => {
    if (rowMap[data.item.id]) {
      rowMap[data.item.id].closeRow();
    }
  };

  bookmarkHotel = (rowMap, data) => {
    console.log('bookmark: ' + data.item.id);
    HotelFinderNative.bookmark(
      data.item.id,
      (err) => {
        console.log(err);
      },
      (bookmarkIds) => {
        this.setState({bookmarkIds: bookmarkIds});
      },
    );
    this.closeRow(rowMap, data);
  };

  forgetHotel = (rowMap, data) => {
    console.log('forget: ' + data.item.id);
    HotelFinderNative.unbookmark(
      data.item.id,
      (err) => {
        console.log(err);
      },
      (bookmarkIds) => {
        this.setState({bookmarkIds: bookmarkIds});
      },
    );
    this.closeRow(rowMap, data);
  };

  isHotelBookmarked = (id, bookmarkIds) => {
    return this.state.bookmarkIds.indexOf(id) > -1;
  };

  renderHiddenItem = (data, rowMap, bookmarkIds) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        rowKey={data}
        rowMap={rowMap}
        bookmarkIds={bookmarkIds}
        onPress={() =>
          this.isHotelBookmarked(data.item.id, bookmarkIds)
            ? this.forgetHotel(rowMap, data)
            : this.bookmarkHotel(rowMap, data)
        }>
        <Text style={styles.backTextWhite}>
          {this.isHotelBookmarked(data.item.id, bookmarkIds)
            ? 'Forget'
            : 'Mark!'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        rowKey={data}
        rowMap={rowMap}
        onPress={() => this.closeRow(rowMap, data)}>
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {description} = this.state;
    const {location} = this.state;

    return (
      <View style={styles.root}>
        <SearchBar
          placeholder="Description"
          lightTheme
          onChangeText={this.updateDescription}
          value={description}
        />
        <SearchBar
          placeholder="Location"
          lightTheme
          onChangeText={this.updateLocation}
          value={location}
        />
        <ElementsButton
          backgroundColor="#0cace0"
          fontSize={20}
          onPress={() => {
            this.onChangeText(this.state.description, this.state.location);
          }}
          title="Lookup"
        />
        <SwipeListView
          data={this.state.hotels}
          bookmarkIds={this.state.bookmarkIds}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          keyExtractor={(item) => item.id}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      </View>
    );
  }
}

const Row = ({item}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.title}>{item.phone}</Text>
    <Text style={styles.title}>{item.address}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  container: {
    flex: 1,
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
});
