using System;

public class TransactionsModelView
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public string Username { get; set; }

    public int Amount { get; set; }

    public int Balance { get; set; }
}