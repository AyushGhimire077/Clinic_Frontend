// const AssginDoctor = () => {

//     return (
//         <>
        
//               <div>
//                   <label htmlFor="doctorId" className={labelClasses}>
//                     Assign Doctor *
//                   </label>
//                   <select
//                     id="doctorId"
//                     name="doctorId"
//                     value={form.doctorId}
//                     onChange={handleChange}
//                     required
//                     className={inputClasses(!!errors.doctorId)}
//                   >
//                     <option value="">Select a doctor</option>
//                     {doctors.map((doctor) => (
//                       <option key={doctor.id} value={doctor.id}>
//                         Dr. {doctor.name} - {doctor.type || "General Physician"}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.doctorId && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.doctorId}
//                     </p>
//                   )}
//                 </div>
//         </>
//     )

// }