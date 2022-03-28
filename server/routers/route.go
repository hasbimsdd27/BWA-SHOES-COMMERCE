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

	api.Get("/", controllers.HelloWorldController)
	api.Post("/category", controllers.CreateCategory)

}
