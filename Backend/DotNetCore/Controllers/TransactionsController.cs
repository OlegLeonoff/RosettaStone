using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace Backend.Controllers
{
    [EnableCors("CorsPolicy")]
    [Authorize(AuthenticationSchemes = "Bearer")] // round brackets content is obligatory 
    public class TransactionsController : Controller
    {
        private readonly VirtualMoneyContext _context;
        private readonly UserManager<User> _userManager;

        public TransactionsController(UserManager<User> userManager,
                                      VirtualMoneyContext context)
        {
            _userManager = userManager;
            _context = context;
        }


        [HttpGet("/api/protected/transactions")]
        public IActionResult Get()
        {
            var userId = HttpContext.User?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value; // get userId from token
            if (userId == null)
                return StatusCode(401, "Invalid user");

            var user = _context.Users
                                .Where(u => u.Id == userId)
                                .Include(u => u.PositiveTransactions)
                                    .ThenInclude(t => t.UserFrom)
                                .Include(u => u.NegativeTransactions)
                                    .ThenInclude(t => t.UserTo)
                                .FirstOrDefault();
            if (user == null)
                return StatusCode(401, "Invalid user");

            var positiveTransactions = user.PositiveTransactions
                                           .Select(t => new TransactionsModelView
                                           {
                                               Id = t.Id,
                                               Date = t.Date,
                                               Username = t.UserFrom.UserName,
                                               Amount = t.Amount,
                                               Balance = t.NewUserToBalance
                                           }).ToList();
            var negativeTransactions = user.NegativeTransactions
                                           .Select(t => new TransactionsModelView
                                           {
                                               Id = t.Id,
                                               Date = t.Date,
                                               Username = t.UserTo.UserName,
                                               Amount = -t.Amount,
                                               Balance = t.NewUserFromBalance
                                           }).ToList();

            var transactions = positiveTransactions.Concat(negativeTransactions).OrderBy(x => x.Date);
            return Ok(new { transactions });
        }


        [HttpPost("/api/protected/transactions")]
        public async Task<IActionResult> Post([FromBody] TransactionCreationModelView transaction)
        {
            // get current user
            var userId = HttpContext.User?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value; // get userId from token

            if (userId == null)
                return StatusCode(401, "Invalid user");
            var userFrom = await _userManager.FindByIdAsync(userId);

            if (transaction.Amount > userFrom.Balance)
                return StatusCode(400, "Balance exceeded");

            var userTo = await _userManager.FindByNameAsync(transaction.Name);
            if (userTo == null)
                return StatusCode(400, "User not found");

            userFrom.Balance -= transaction.Amount;
            userTo.Balance += transaction.Amount;
            var newTransactionEntry = new Models.Transaction { Date = DateTime.Now,
                                                               UserFromId = userFrom.Id,
                                                               UserToId = userTo.Id,
                                                               Amount = transaction.Amount,
                                                               NewUserFromBalance = userFrom.Balance,
                                                               NewUserToBalance = userTo.Balance };

            _context.Transactions.Add(newTransactionEntry);
            _context.SaveChanges();
            var transactionResp = new TransactionCreationResultView { Id = newTransactionEntry.Id,
                                                                     Date = newTransactionEntry.Date,
                                                                     Username = userTo.UserName,
                                                                     Amount = transaction.Amount,
                                                                     Balance = userFrom.Balance };
            return Ok(new { transaction = transactionResp });
        }
    }
}
