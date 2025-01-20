import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Expense = {
  id: string;
  description: string;
  amount: number;
};

const Home = ({}: Props) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const addExpense = () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Please enter both description and amount');
      return;
    }

    const newExpense: Expense = {
      id: editId || new Date().toISOString(),
      description,
      amount: parseFloat(amount),
    };

    if (editId) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editId ? newExpense : expense
        )
      );
      setEditId(null);
    } else {
      setExpenses((prev) => [...prev, newExpense]);
    }

    setDescription('');
    setAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const editExpense = (id: string) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount.toString());
      setEditId(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Expense Tracker
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Button
          title={editId ? 'Update Expense' : 'Add Expense'}
          onPress={addExpense}
        />
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text variant="bodyLarge">
              {item.description} - ${item.amount.toFixed(2)}
            </Text>
            <View style={styles.buttons}>
              <Button
                title="Edit"
                onPress={() => editExpense(item.id)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteExpense(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.emptyMessage}>
            No expenses yet. Add some!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
