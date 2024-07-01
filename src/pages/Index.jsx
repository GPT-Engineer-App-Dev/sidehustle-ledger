import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const placeholderTransactions = [
  { id: 1, date: new Date(), amount: 100, type: "Income", brand: "Nike" },
  { id: 2, date: new Date(), amount: 200, type: "Expense", brand: "Adidas" },
];

function Index() {
  const [transactions, setTransactions] = useState(placeholderTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleSaveTransaction = (transaction) => {
    if (transaction.id) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === transaction.id ? transaction : t))
      );
    } else {
      transaction.id = transactions.length + 1;
      setTransactions((prev) => [...prev, transaction]);
    }
    setIsDialogOpen(false);
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">Sneaker Transactions</h1>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentTransaction(null)}>Add New Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={currentTransaction}
              onSave={handleSaveTransaction}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <TransactionTable
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}

function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(transaction.date, "yyyy-MM-dd")}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>{transaction.brand}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TransactionForm({ transaction, onSave, onCancel }) {
  const [date, setDate] = useState(transaction?.date || "");
  const [amount, setAmount] = useState(transaction?.amount || "");
  const [type, setType] = useState(transaction?.type || "Income");
  const [brand, setBrand] = useState(transaction?.brand || "Nike");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: transaction?.id, date, amount, type, brand });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="brand">Brand</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nike">Nike</SelectItem>
            <SelectItem value="Adidas">Adidas</SelectItem>
            <SelectItem value="Puma">Puma</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="mr-2">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default Index;