from datetime import datetime,date


#create a dateconverter class that will be used to convert the date from the url to a datetime object
class DateConverter:
    regex = r'\d{4}-\d{2}-\d{2}'
    def to_python(self, value):
        return datetime.strptime(value, '%Y-%m-%d').date()
    def to_url(self, value):
        return value.strftime('%Y-%m-%d')