package routers

import (
	"server/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRouter(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/products", controllers.GetAllProducts)
	api.Get("/product/:id", controllers.GetDetailProduct)
	api.Post("/product", controllers.CreateProduct)
	api.Put("/product/:id", controllers.UpdateProduct)
	api.Delete("/product/:id", controllers.DeleteProduct)

	api.Get("/categories", controllers.GetAllCategory)
	api.Get("/category/:id", controllers.GetDetailCategory)
	api.Post("/category", controllers.CreateCategory)
	api.Put("/category/:id", controllers.UpdateCategory)
	api.Delete("/category/:id", controllers.DeleteCategory)

	api.Post("/register", controllers.Register)
	api.Post("/login", controllers.Login)
	api.Post("/login-admin", controllers.LoginAdmin)

}
