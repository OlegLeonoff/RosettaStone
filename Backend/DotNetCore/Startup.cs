using System;
using System.Text;
using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Models;

namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        TokenValidationParameters GetTokenValidationParameters() {
            var issuer = Configuration["Tokens:Issuer"];
            var audience = Configuration["Tokens:Audience"];
            var key =  Configuration["Tokens:Key"];
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            return  new TokenValidationParameters()
                    {
                        ValidIssuer = issuer,
                        ValidAudience = audience,
                        IssuerSigningKey = signingKey,
                        ClockSkew = TimeSpan.Zero,

                        // security switches
                        RequireExpirationTime = true,
                        ValidateIssuer = true,
                        ValidateIssuerSigningKey = true,
                        ValidateAudience = true
                    };
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials() );
            });
            services.AddAuthentication(opts =>
            {
                opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.RequireHttpsMetadata = false;
                jwtBearerOptions.SaveToken = true;
                jwtBearerOptions.TokenValidationParameters = GetTokenValidationParameters();
            });

            services.AddMvc();

            // Add ASP.NET Identity support
            services.AddIdentity<User, IdentityRole>(
                opts =>
                {
                    opts.Password.RequireDigit = true;
                    opts.Password.RequireLowercase = true;
                    opts.Password.RequireUppercase = true;
                    opts.Password.RequireNonAlphanumeric = false;
                    opts.Password.RequiredLength = 7;
                })
                .AddEntityFrameworkStores<VirtualMoneyContext>();

            // services.AddTransient<IUserManager, UserManager>();
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddEntityFrameworkSqlite()
                    .AddDbContext<VirtualMoneyContext>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseMvc();
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<VirtualMoneyContext>();
                var roleManager = serviceScope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
                var userManager = serviceScope.ServiceProvider.GetService<UserManager<User>>();

                DbSeeder.Seed(dbContext, roleManager, userManager);               
            }
        }
    }
}
