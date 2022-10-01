
import { StyleSheet, Text, View, TextInput, Button, FlatList } from "react-native";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import { useState } from "react";

const db = SQLite.openDatabase("shoppingdb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppinglist, setShoppinglist] = useState([]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists shopping (id integer primary key not null, product text, amount text);"
        );
      },
      null,
      updateList
    );
  }, []);

  const saveProduct = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into shopping (product, amount) values (?, ?);", [
          product,
          amount,
        ]);
      },
      null,
      updateList
    );
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from shopping;", [], (_, { rows }) =>
        setShoppinglist(rows._array)
      );
    });
  };

  const deleteProduct = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product"
        style={{
          marginTop: 60,
          fontSize: 20,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        placeholder="Amount"
        style={{
          marginTop: 10,
          marginBottom: 10,
          fontSize: 20,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveProduct} title="Save" />
      <Text style={{marginTop: 30, fontSize: 24, fontWeight: "bold"}}>Products</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 20, marginTop: 5}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 20, color: '#0000ff', marginTop: 5}} onPress={() => deleteProduct(item.id)}> Bought</Text></View>} 
        data={shoppinglist}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
