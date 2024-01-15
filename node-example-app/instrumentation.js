/*instrumentation.js*/
const opentelemetry = require('@opentelemetry/sdk-node');
const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
    OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
const {
    OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-proto');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { KnexInstrumentation } = require('@opentelemetry/instrumentation-knex');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

require('dotenv').config()

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        // optional - default url is http://localhost:4318/v1/traces
        url: 'http://localhost:4318/v1/traces',
        // optional - collection of custom headers to be sent with each request, empty by default
        headers: {},
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://localhost:4318/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
            headers: {}, // an optional object containing custom headers to be sent with each request
            concurrencyLimit: 1, // an optional limit on pending requests
        }),
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new KnexInstrumentation(
            {
                maxQueryLength: 100,
            }
        ),
        new PgInstrumentation({
            addSqlCommenterCommentToQueries: true,
        }),
        new ExpressInstrumentation(),
    ],
});
sdk.start();