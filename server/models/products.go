package models

import (
	"time"

	"gorm.io/gorm"
)

type Products struct {
	ID          uint              `json:"id" gorm:"primary_key;autoIncrement"`
	Name        string            `json:"name"`
	Price       float32           `json:"price"`
	Description string            `json:"description" gorm:"type:text"`
	Tags        string            `json:"tags"`
	CategoryId  int               `json:"category_id"`
	Galeries    []ProductGaleries `gorm:"foreignKey:ProductId"`
	Category    ProductCategories `gorm:"foreignKey:CategoryId"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `json:"-"`
}
