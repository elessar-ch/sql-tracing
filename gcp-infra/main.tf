terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file("./credentials/sql-trace-terraform.json")

  project = "sql-trace"
  region  = "europe-west6"
  zone    = "europe-west6-c"
}

resource "google_sql_database_instance" "main" {
  name             = "trace-test"
  database_version = "POSTGRES_15"
  region           = "europe-west6"

  settings {
    tier = "db-f1-micro"

    disk_type       = "PD_HDD"
    disk_size       = 10
    disk_autoresize = true

    availability_type = "ZONAL"

    backup_configuration {
      enabled = false
    }

    ip_configuration {
      ipv4_enabled = true
      require_ssl  = false

      authorized_networks {
        value = "213.55.243.210/32"
      }
    }

    insights_config {
      query_insights_enabled  = true
      record_application_tags = true
    }
  }
}

resource "google_sql_database" "knexdb" {
  name     = "knexdb"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "knexuser" {
  name     = "knexuser"
  instance = google_sql_database_instance.main.name
  password = "knexpw"
}

resource "google_service_account" "opentelemetry" {
  account_id   = "opentelemetry"
  display_name = "OpenTelemetry Service Account"
  project      = "sql-trace"
}

resource "google_project_iam_member" "opentelemetry_cloudtraceagent" {
  project = "sql-trace"
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.opentelemetry.email}"
}

resource "google_project_iam_member" "opentelemetry_monitoringmetricwriter" {
  project = "sql-trace"
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.opentelemetry.email}"
}

resource "google_project_iam_member" "opentelemetry_logginglogwriter" {
  project = "sql-trace"
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.opentelemetry.email}"
}
