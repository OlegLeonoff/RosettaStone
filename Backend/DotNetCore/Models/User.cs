using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models{
    public class User : IdentityUser
    {
        public User()
        {

        }

        public int Balance { get; set; }

        public DateTime Date { get; set; }

        [InverseProperty("UserTo")]
        public virtual ICollection<Transaction> PositiveTransactions { get; set; }

        [InverseProperty("UserFrom")]
        public virtual ICollection<Transaction> NegativeTransactions { get; set; }
    }
}