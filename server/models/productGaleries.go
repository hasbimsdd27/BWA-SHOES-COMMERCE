package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductGaleries struct {
	ID        uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	ProductId uuid.UUID `json:"product_id" gorm:"type:uuid" `
	Url       string    `json:"url"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
