package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionItems struct {
	ID                 uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	TransactionId      uuid.UUID `gorm:"type:VARCHAR(255)" json:"transaction_id"`
	Quantity           int       `json:"quantity"`
	ProductImage       string    `json:"product_image"`
	ProductPrice       float32   `json:"product_price"`
	ProductDescription string    `gorm:"type:TEXT" json:"product_description"`
	ProductCategory    string    `json:"product_category"`
	ProductWeight      float32   `json:"product_weight"`
	ProductTags        string    `json:"product_tags"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	DeletedAt          gorm.DeletedAt `json:"-"`
}
