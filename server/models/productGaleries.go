package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductGaleries struct {
	ID        uint   `json:"id" gorm:"primary_key;autoIncrement"`
	ProductId int    `json:"product_id" gorm:"\"property_group\"(id)" `
	Url       string `json:"url"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
