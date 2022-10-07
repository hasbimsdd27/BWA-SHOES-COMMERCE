package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRouter(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/products/landing", controllers.GetCustomProduct)
	api.Get("/products", controllers.GetAllProducts)
	api.Get("/product/:id", controllers.GetDetailProduct)
	api.Post("/product", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.CreateProduct)
	api.Put("/product/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.UpdateProduct)
	api.Delete("/product/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.DeleteProduct)

	api.Get("/categories", controllers.GetAllCategory)
	api.Get("/category/:id", middlewares.MiddlewareUser, controllers.GetDetailCategory)
	api.Post("/category", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.CreateCategory)
	api.Put("/category/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.UpdateCategory)
	api.Delete("/category/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.DeleteCategory)
	api.Post("/category/delete", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.BulkDeleteCategory)

	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)
	api.Post("/login-admin", controllers.LoginAdmin)
	api.Post("/user/profile", middlewares.MiddlewareUser, controllers.UpdateUserprofile)
	api.Get("/user/profile", middlewares.MiddlewareUser, controllers.GetUserProfile)

	api.Post("/assets", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.UploadAssets)
	api.Delete("/assets/:imageName", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.DeleteAssets)

	api.Post("/cart", middlewares.MiddlewareUser, controllers.CreateUpdateCart)
	api.Delete("/cart/:id", middlewares.MiddlewareUser, controllers.DeleteCart)
	api.Get("/carts", middlewares.MiddlewareUser, controllers.GetCarts)

	api.Get("/ongkir/search", middlewares.MiddlewareUser, controllers.QueryArea)
	api.Post("/ongkir/cost", middlewares.MiddlewareUser, controllers.GetOngkir)

	api.Post("/transaction", middlewares.MiddlewareUser, controllers.CreateTransaction)

	api.Post("/webhook", controllers.WebhookController)

}
