from django.test import TestCase
class DummyTestCase(TestCase):
    def setUp(self):
        self.number1 = 2
        self.number2 = 5

    def test_assertion(self):
        """Animals that can speak are correctly identified"""
        self.assertNotEqual(2, 5)
        self.assertNotEqual(self.number1, 5)
        self.assertNotEqual(1, self.number2)
        self.assertNotEqual(self.number1, self.number2)
        # self.assertNotEqual(2, 2)