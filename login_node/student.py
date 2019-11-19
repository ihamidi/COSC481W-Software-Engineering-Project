from people import People

class Student(People):
    def __init__(self, SID):
        super().__init__
        self.SID=SID

    def getSID(self):
        return self.SID

    def setSID(self,SID1):
        self.SID=SID1
