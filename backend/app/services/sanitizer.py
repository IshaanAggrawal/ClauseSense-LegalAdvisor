from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from presidio_analyzer.nlp_engine import SpacyNlpEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider

class DataSanitizer:
    def __init__(self):
        try:
            # Configure NlpEngine with the smaller model
            configuration = {
                "nlp_engine_name": "spacy",
                "models": [{"lang_code": "en", "model_name": "en_core_web_sm"}]
            }
            provider = NlpEngineProvider(nlp_configuration=configuration)
            self.nlp_engine = provider.create_engine()
            
            # Initialize analyzer with the configured NLP engine
            self.analyzer = AnalyzerEngine(nlp_engine=self.nlp_engine)
            self.anonymizer = AnonymizerEngine()
        except Exception as e:
            raise RuntimeError(f"Failed to initialize sanitizer: {str(e)}")

    def sanitize(self, text: str) -> str:
        # Analyze the text for sensitive entities
        results = self.analyzer.analyze(text=text, language='en')
        return self.anonymizer.anonymize(
            text=text,
            analyzer_results=results,
            operators={
                "DEFAULT": OperatorConfig("replace", {"new_value": "<REDACTED>"}),
                "PERSON": OperatorConfig("replace", {"new_value": "<CLIENT>"}),
                "PHONE_NUMBER": OperatorConfig("replace", {"new_value": "<PHONE>"}),
                "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "<EMAIL>"}),
            }
        ).text