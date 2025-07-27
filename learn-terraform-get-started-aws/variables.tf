variable "instance_name" {
  description = "Value of the EC2 instance's Name tag."
  type        = string
  default     = "learn-terraform"
}

variable "instance_type" {
  description = "The EC2 instance's type."
  type        = string
  default     = "t2.micro"
}

variable "instance_subnet" {
  description = "The EC2 instance's default subnet at ap-northeast-1."
  type        = string
  default     = "subnet-007290854ed7640c5" # Tokyo region must specify subnet_id.
}

