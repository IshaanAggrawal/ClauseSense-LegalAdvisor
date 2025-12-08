from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from presidio_analyzer.nlp_engine import SpacyNlpEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider

class DataSanitizer:
    def __init__(self):
        # Use NlpEngineProvider to create the NLP engine with proper configuration
        provider = NlpEngineProvider(conf_file=None)
        self.nlp_engine = provider.create_engine()
        
        # Pass the correctly configured nlp_engine instance to the AnalyzerEngine
        self.analyzer = AnalyzerEngine(nlp_engine=self.nlp_engine)
        self.anonymizer = AnonymizerEngine()

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