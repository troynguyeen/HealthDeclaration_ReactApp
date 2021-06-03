import React, { useState, useEffect } from 'react';

const useForm = (initialFieldValues, validate, setValueDate, setValueNationality, setIsOtherNationality,
                setIsYes1, setIsYes2, setValueAnswer1, setValueAnswer2, setSelectedRow1, setSelectedRow2, setSelectedRow3, setCurrentId,) => {
    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const fieldValue = {[name]: value}

        setValues({
            ...values,
            ...fieldValue
        })

        validate(fieldValue)
    }

    const resetForm = () => {
        setValues({
            ...initialFieldValues
        })
        setErrors({})
        setValueDate(null)
        setValueNationality('')
        setIsOtherNationality(false)
        setIsYes1(false)
        setValueAnswer1('')
        setIsYes2(false)
        setValueAnswer2('')
        setSelectedRow1('')
        setSelectedRow2('')
        setSelectedRow3('')
        setCurrentId(0)
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    };
}
 
export default useForm;