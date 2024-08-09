from django.apps import AppConfig


class ItMisConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'it_mis'
    def ready(self):
        import it_mis.signals