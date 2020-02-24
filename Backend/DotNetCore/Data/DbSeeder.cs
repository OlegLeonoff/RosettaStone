using Microsoft.AspNetCore.Identity;
using Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Data
{
    public class DbSeeder
    {

        public static void Seed(
            VirtualMoneyContext dbContext,
            RoleManager<IdentityRole> roleManager,
            UserManager<User> userManager
            )
        {
            // Create default Users (if there are none)
            if (!dbContext.Users.Any())
            {
                CreateUsers(dbContext, roleManager, userManager)
                    .GetAwaiter()
                    .GetResult();
            }
        }

        private static async Task CreateUsers(
            VirtualMoneyContext dbContext,
            RoleManager<IdentityRole> roleManager,
            UserManager<User> userManager)
        {
            // local variables
            DateTime createdDate = new DateTime(2019, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            string role_Administrator = "Administrator";
            string role_RegisteredUser = "RegisteredUser";

            //Create Roles (if they doesn't exist yet)
            if (!await roleManager.RoleExistsAsync(role_Administrator))
            {
                await roleManager.CreateAsync(new IdentityRole(role_Administrator));
            }
            if (!await roleManager.RoleExistsAsync(role_RegisteredUser))
            {
                await roleManager.CreateAsync(new IdentityRole(role_RegisteredUser));
            }

            // Create the "Admin" ApplicationUser account
            var user_Admin = new User()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "admin@testmakerfree.com",
                Date = createdDate,
                Balance = 500
            };
            // Insert "Admin" into the Database and assign the "Administrator" and "Registered" roles to him.
            if (await userManager.FindByIdAsync(user_Admin.Id) == null)
            {
                await userManager.CreateAsync(user_Admin, "Pass4Admin");
                await userManager.AddToRoleAsync(user_Admin, role_RegisteredUser);
                await userManager.AddToRoleAsync(user_Admin, role_Administrator);
                // Remove Lockout and E-Mail confirmation.
                user_Admin.EmailConfirmed = true;
                user_Admin.LockoutEnabled = false;
            }

#if DEBUG
            // Create some sample registered user accounts
            var user_Ryan = new User()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = "Ryan",
                Email = "ryan@testmakerfree.com",
                Date = createdDate,
                Balance = 500
            };

            var user_Solice = new User()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = "Solice",
                Email = "solice@testmakerfree.com",
                Date = createdDate,
                Balance = 500
            };

            // Insert sample registered users into the Database and also assign the "Registered" role to him.
            if (await userManager.FindByIdAsync(user_Ryan.Id) == null)
            {
                await userManager.CreateAsync(user_Ryan, "Pass4Ryan");
                await userManager.AddToRoleAsync(user_Ryan, role_RegisteredUser);
                // Remove Lockout and E-Mail confirmation.
                user_Ryan.EmailConfirmed = true;
                user_Ryan.LockoutEnabled = false;
            }
            if (await userManager.FindByIdAsync(user_Solice.Id) == null)
            {
                await userManager.CreateAsync(user_Solice, "Pass4Solice");
                await userManager.AddToRoleAsync(user_Solice, role_RegisteredUser);
                // Remove Lockout and E-Mail confirmation.
                user_Solice.EmailConfirmed = true;
                user_Solice.LockoutEnabled = false;
            }

#endif
            await dbContext.SaveChangesAsync();
        }
    }
}
