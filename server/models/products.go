package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Products struct {
	ID          uuid.UUID         `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	Name        string            `json:"name"`
	Price       float32           `json:"price"`
	Description string            `json:"description" gorm:"type:text"`
	Tags        string            `json:"tags"`
	CategoryId  string            `gorm:"type:VARCHAR(255)" json:"category_id"`
	Galeries    []ProductGaleries `gorm:"foreignKey:ProductId"`
	Category    ProductCategories `gorm:"foreignKey:CategoryId"`
	Rating      float32           `json:"rating"`
	Purchased   int               `json:"purchased"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `json:"-"`
}
