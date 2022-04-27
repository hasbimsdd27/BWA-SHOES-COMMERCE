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
	api.Post("/product", controllers.CreateProduct)
	api.Put("/product/:id", controllers.UpdateProduct)
	api.Delete("/product/:id", controllers.DeleteProduct)

	api.Get("/categories", controllers.GetAllCategory)
	api.Get("/category/:id", middlewares.MiddlewareUser, controllers.GetDetailCategory)
	api.Post("/category", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.CreateCategory)
	api.Put("/category/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.UpdateCategory)
	api.Delete("/category/:id", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.DeleteCategory)
	api.Post("/category/delete", middlewares.MiddlewareUser, middlewares.IsAdmin, controllers.BulkDeleteCategory)

	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)
	api.Post("/login-admin", controllers.LoginAdmin)

	api.Post("/assets", controllers.UploadAssets)
	api.Delete("/assets/:imageName", controllers.DeleteAssets)

}
