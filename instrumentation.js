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

const { KnexInstrumentation, KnexInstrumentationConfig } = require('@opentelemetry/instrumentation-knex');
// const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');

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
    ],
});
sdk.start();


// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
// const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
// const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');

// const exporter = new CollectorTraceExporter();
// const provider = new NodeTracerProvider({
//     resource: new Resource({
//         [SemanticResourceAttributes.SERVICE_NAME]: 'basic-service',
//     }),
// });
// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
// provider.register();

// registerInstrumentations({
//     instrumentations: [
//         getNodeAutoInstrumentations({
//             // load custom configuration for http instrumentation
//             '@opentelemetry/instrumentation-http': {
//                 applyCustomAttributesOnSpan: (span) => {
//                     span.setAttribute('foo2', 'bar2');
//                 },
//             },
//         }),
//     ],
// });