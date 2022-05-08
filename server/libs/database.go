package libs

import (
	"fmt"
	"log"
	"os"
	"server/models"
	"server/utils"
	"strconv"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second,   // Slow SQL threshold
			LogLevel:                  logger.Silent, // Log level
			IgnoreRecordNotFoundError: true,          // Ignore ErrRecordNotFound error for logger
			Colorful:                  false,         // Disable color
		},
	)

	p := utils.GetENV("DB_PORT")

	port, err := strconv.ParseUint(p, 10, 32)

	if err != nil {
		log.Println("Port Parsing Failed")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		utils.GetENV("DB_USERNAME"), utils.GetENV("DB_PASSWORD"), utils.GetENV("DB_HOST"), port, utils.GetENV("DB_NAME"),
	)

	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		panic(err.Error())
	}

	DB.Debug().AutoMigrate(
		&models.ProductCategories{},
		&models.Users{},
		&models.Products{},
		&models.ProductGaleries{},
		&models.Transactions{},
		&models.TransactionItems{},
		&models.UserAddress{},
		&models.UserCart{},
	)

	fmt.Println("Connection opened to database")
}
