using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string UserFromId { get; set; }

        public virtual User UserFrom { get; set; }

        public string UserToId { get; set; }

        public virtual User UserTo { get; set; }

        public int Amount { get; set; }

        public int NewUserToBalance { get; set; }

        public int NewUserFromBalance { get; set; }
    }
}
