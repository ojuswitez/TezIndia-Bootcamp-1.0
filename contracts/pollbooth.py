import smartpy as sp

class Pollbooth(sp.Contract):
    def __init__(self, params):
        self.init(
            question = params.question,
            options = sp.map(
                l = {},
                tkey = sp.TString,
                tvalue = sp.TNat
            )
        )
    
    @sp.entry_point
    def add_option(self, option_string):
        self.data.options[option_string] = 0
    
    @sp.entry_point
    def vote(self, option_string):
        self.data.options[option_string] += 1


@sp.add_test(name = "Pollbooth")
def test():
    scenario = sp.test_scenario()

    scenario.h1("Setting up...")
    contract = Pollbooth(
        sp.record(
            question = "Is smartpy easy?"
        )
    )
    scenario += contract

    scenario.h1("Adding options...")
    contract.add_option("yes")
    contract.add_option("no")

    scenario.h1("Voting for the options...")
    contract.vote("yes")
    contract.vote("yes")
    contract.vote("no")
    contract.vote("yes")
    contract.vote("no")