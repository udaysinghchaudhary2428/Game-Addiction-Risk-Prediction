from pydantic import BaseModel, Field, field_validator,model_validator
from typing import Literal, Annotated


class UserInput(BaseModel):
    
    loss_of_other_interests: Annotated[
        bool,
        Field(description="Whether user has lost interest in other activities", examples=[True, False])
    ] = True

    withdrawal_symptoms: Annotated[
        bool,
        Field(description="Presence of withdrawal symptoms", examples=[True, False])
    ] = True

    continued_despite_problems: Annotated[
        bool,
        Field(description="Continues gaming despite problems", examples=[True, False])
    ] = True

    
    academic_work_performance: Annotated[
        Literal['Failing', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'],
        Field(description="Academic performance level")
    ] = "Good"

    sleep_disruption_frequency: Annotated[
        Literal['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        Field(description="Sleep disruption frequency")
    ] = "Rarely"

    social_isolation_score: Annotated[
        float,
        Field(description="Level of social isolation", ge=0,le=10)
    ] = 5.0
   
    daily_gaming_hours: Annotated[
        float,
        Field(description="Daily gaming hours", ge=0, le=24)
    ] = 3.0

    sleep_hours: Annotated[
        float,
        Field(description="Daily sleep hours", ge=0, le=24)
    ] = 6.0

    monthly_game_spending_usd: Annotated[
        float,
        Field(description="Monthly spending on gaming (USD)", ge=0)
    ] = 50.0


    #--------------Validation methods-------------------------

    #---------------------------- Field-level validation methods -------------------------
    @field_validator(
            "academic_work_performance",
            "sleep_disruption_frequency",
            mode="before"
        )
    def text_validation(cls,value):

        if not isinstance(value,str):
            raise ValueError("Value must be a string")
        
        return " ".join(value.split()).title()
    
    @field_validator(
            "sleep_hours",
            "daily_gaming_hours",
            "social_isolation_score",
            "monthly_game_spending_usd",
            mode="before"
            )
    def numeric_validation(cls,value):

        if not isinstance(value,(int,float)):
            raise ValueError("Value must be a non-negative number")
        
        return value
    
    @field_validator(
            "loss_of_other_interests",
            "withdrawal_symptoms",
            "continued_despite_problems",
            mode="before"
        )
    
    def boolean_validation(cls,value):

        if not isinstance(value,bool):
            raise ValueError("Value must be boolean (true or false)")
        return value
    

    # --------------------Model-level validation methods-----------------

    @model_validator(mode="after")
    def total_time_validation(self):
        total = self.daily_gaming_hours + self.sleep_hours

        if total > 24:
            raise ValueError(
                f"Invalid total hours: gaming ({self.daily_gaming_hours}) + sleep ({self.sleep_hours}) = {total}, must not exceed 24"
            )

        return self